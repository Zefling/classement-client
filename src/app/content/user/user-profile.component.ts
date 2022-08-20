import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import owasp from 'owasp-password-strength-test';
import { debounceTime, Subscription } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog.component';
import { MessageService, MessageType } from 'src/app/components/info-messages.component';
import { Classement, User } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { Utils } from 'src/app/tools/utils';


@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnDestroy {
    user?: User;

    listener: Subscription[] = [];

    showError: string[] = [];

    @ViewChild('dialogChangePassword') dialogChangePassword!: DialogComponent;
    changePasswordForm: FormGroup;
    strong = false;
    confirm = false;
    passedTests: number[] = [];

    @ViewChild('dialogChangeEmail') dialogChangeEmail!: DialogComponent;
    changeEmailForm: FormGroup;
    emailOldValid = false;
    emailNewValid = false;

    @ViewChild('dialogRemoveClassement') dialogRemoveClassement!: DialogComponent;
    currentClassement?: Classement;

    @ViewChild('dialogRemoveProfile') dialogRemoveProfile!: DialogComponent;

    constructor(
        private router: Router,
        private userService: APIUserService,
        private classementService: APIClassementService,
        private messageService: MessageService,
        private translate: TranslateService,
    ) {
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

        // password

        this.changePasswordForm = new FormGroup({
            passwordOld: new FormControl(''),
            password: new FormControl(''),
            password2: new FormControl(''),
        });

        this.changePasswordForm.get('password')?.valueChanges.subscribe(value => {
            const test = owasp.test(value);
            this.passedTests = test.passedTests;
            this.strong = test.strong || test.isPassphrase;
        });
        this.changePasswordForm.get('password2')?.valueChanges.subscribe(value => {
            this.confirm = this.strong && this.changePasswordForm.get('password')?.value === value;
        });

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

    valideChangePassword() {
        var value = this.changePasswordForm.value;

        const test = owasp.test(value.password);

        if (value.password !== value.password2) {
            this.showError.push(this.translate.instant('error.pw.duplicate'));
        }

        if (test.errors?.length) {
            test.errors.forEach(e =>
                this.showError.push(
                    this.translate.instant('error.owasp.' + e.replace(/\d+/, '*')).replace('%', e.match(/\d+/)?.[0]),
                ),
            );
        }

        if (!this.showError.length) {
            this.userService
                .update(value.passwordOld, value.password, 'password')
                .then(() => {
                    this.dialogChangePassword.close();
                    this.messageService.addMessage(this.translate.instant('message.server.update.password.success'));
                })
                .catch(e => {
                    this.messageService.addMessage(e, MessageType.error);
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
                    this.messageService.addMessage(e, MessageType.error);
                });
        } else if (!value.emailOld && !value.emailNew) {
            this.showError[0] = this.translate.instant('error.email.old.invalid');
        }
    }

    delete(classement: Classement): void {
        this.currentClassement = classement;
        this.dialogRemoveClassement.open();
    }

    deleteCurrentClassement(remove: boolean): void {
        if (remove) {
            this.classementService.deleteClassement(this.currentClassement!.rankingId).then(() => {
                this.user?.classements?.splice(this.user?.classements?.indexOf(this.currentClassement!), 1);
                this.messageService.addMessage(this.translate.instant('message.server.deleted.success'));
                this.currentClassement = undefined;
            });
        } else {
            this.currentClassement = undefined;
        }
        this.dialogRemoveClassement.close();
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
                this.messageService.addMessage(e, MessageType.error);
            });
    }
}
