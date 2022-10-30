import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { debounceTime, Subscription } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MessageService, MessageType } from 'src/app/components/info-messages/info-messages.component';
import { User } from 'src/app/interface';
import { APIUserService } from 'src/app/services/api.user.service';
import { Utils } from 'src/app/tools/utils';

import { UserPassword } from './user-password';


@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent extends UserPassword implements OnDestroy {
    user?: User;

    listener: Subscription[] = [];

    @ViewChild('dialogChangePassword') dialogChangePassword!: DialogComponent;

    @ViewChild('dialogChangeEmail') dialogChangeEmail!: DialogComponent;
    changeEmailForm: FormGroup;
    emailOldValid = false;
    emailNewValid = false;

    @ViewChild('dialogRemoveProfile') dialogRemoveProfile!: DialogComponent;

    constructor(
        private router: Router,
        userService: APIUserService,
        messageService: MessageService,
        translate: TranslateService,
    ) {
        super(userService, messageService, translate);

        this.listener.push(
            this.userService.afterLoggin.subscribe(() => {
                if (!this.userService.logged) {
                    this.router.navigate(['/profil/login']);
                } else {
                    this.user = this.userService.user;
                }
            }),
            this.userService.afterLogout.subscribe(() => {
                this.router.navigate(['/user/login']);
            }),
        );

        if (!this.userService.token) {
            this.router.navigate(['/user/login']);
        }

        this.user = this.userService.user;

        // email

        this.changeEmailForm = new FormGroup({
            emailOld: new FormControl(''),
            emailNew: new FormControl(''),
        });

        this.changeEmailForm.get('emailOld')?.valueChanges.subscribe(value => {
            this.emailOldValid = Utils.testEmail(value);
            this.showError[0] = value && !this.emailOldValid ? this.translate.instant('error.email.old.invalid') : '';
        });
        this.changeEmailForm
            .get('emailNew')
            ?.valueChanges.pipe(debounceTime(500))
            .subscribe(value => {
                if (Utils.testEmail(value)) {
                    this.userService
                        .test('email', value)
                        .then(test => {
                            this.emailNewValid = !test;
                            this.showError[1] = test ? this.translate.instant('error.email.already.used') : '';
                        })
                        .catch(e => {
                            this.emailNewValid = false;
                            this.showError[1] = e;
                        });
                } else if (value) {
                    this.emailNewValid = false;
                    this.showError[1] = this.translate.instant('error.email.new.invalid');
                }
            });
    }

    changePassword(): void {
        this.showError = [];
        this.changePasswordForm.get('passwordOld')?.setValue('');
        this.changePasswordForm.get('password')?.setValue('');
        this.changePasswordForm.get('password2')?.setValue('');
        this.dialogChangePassword.open();
    }

    changeEmail(): void {
        this.showError = [];
        this.changeEmailForm.get('emailOld')?.setValue('');
        this.changeEmailForm.get('emailNew')?.setValue('');
        this.dialogChangeEmail.open();
    }

    ngOnDestroy(): void {
        this.listener.forEach(e => e.unsubscribe());
    }

    override formGroupPasswordForm() {
        return {
            passwordOld: new FormControl(''),
            password: new FormControl(''),
            password2: new FormControl(''),
        };
    }

    override valideChangePassword() {
        var value = super.valideChangePassword();

        if (!this.showError.length) {
            this.userService
                .update(value.passwordOld, value.password, 'password')
                .then(() => {
                    this.dialogChangePassword.close();
                    this.messageService.addMessage(this.translate.instant('message.server.update.password.success'));
                })
                .catch(e => {
                    this.messageService.addMessage(e, { type: MessageType.error });
                });
        }
    }

    valideChangeEmail() {
        var value = this.changeEmailForm.value;

        if (this.emailNewValid) {
            this.userService
                .update(value.emailOld, value.emailNew, 'email')
                .then(() => {
                    this.dialogChangePassword.close();
                    this.messageService.addMessage(this.translate.instant('message.server.update.password.success'));
                })
                .catch(e => {
                    this.messageService.addMessage(e, { type: MessageType.error });
                });
        } else if (!value.emailOld && !value.emailNew) {
            this.showError[0] = this.translate.instant('error.email.old.invalid');
        }
    }

    removeProfile() {
        this.dialogRemoveProfile.open();
    }

    valideRemoveProfile() {
        this.userService
            .remove()
            .then(() => {
                this.userService.reset();
                this.dialogRemoveProfile.close();
                this.messageService.addMessage(this.translate.instant('message.user.remove.success'));
                this.router.navigate(['/user/login']);
            })
            .catch(e => {
                this.messageService.addMessage(e, { type: MessageType.error });
            });
    }
}
