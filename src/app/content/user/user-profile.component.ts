import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { debounceTime } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MessageService, MessageType } from 'src/app/components/info-messages/info-messages.component';
import { FileHandle, User } from 'src/app/interface';
import { APIUserService } from 'src/app/services/api.user.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';

import { UserPassword } from './user-password';

@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent extends UserPassword implements OnDestroy {
    user?: User;

    listener = Subscriptions.instance();

    @ViewChild('avatarDialog') avatarDialog!: DialogComponent;
    @ViewChild('dialogChangePassword') dialogChangePassword!: DialogComponent;
    @ViewChild('dialogRemoveProfile') dialogRemoveProfile!: DialogComponent;
    @ViewChild('dialogChangeEmail') dialogChangeEmail!: DialogComponent;

    @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;
    @ViewChild('imageCropper') imageCropper!: ImageCropperComponent;

    changeEmailForm: FormGroup;
    emailOldValid = false;
    emailNewValid = false;

    imageChangedEvent?: Event;
    imageBase64: string = '';
    croppedImage?: string;

    constructor(
        private readonly router: Router,
        private readonly title: Title,
        userService: APIUserService,
        messageService: MessageService,
        translate: TranslateService,
    ) {
        super(userService, messageService, translate);

        this.updateTitle();

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
            this.translate.onLangChange.subscribe(() => {
                this.updateTitle();
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

    updateTitle() {
        this.title.setTitle(`${this.translate.instant('menu.profile')} - ${this.translate.instant('classement')}`);
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
        this.listener.clear();
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

    fileChangeEvent(event: Event): void {
        this.imageChangedEvent = event;
    }

    fileChange(event: FileHandle | string) {
        if ((event as FileHandle).target) {
            this.imageBase64 = (event as FileHandle).target?.result as string;
        }
    }

    avatarEdit() {
        this.avatarDialog.open();
    }

    async imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64!;
    }

    imageLoaded(_image: LoadedImage) {
        // show cropper
        setTimeout(() => {
            // fix init position for the cropper
            this.imageCropper.resetCropperPosition();
        });
    }

    cropperReady() {
        // cropper ready
    }

    loadImageFailed() {
        // show message
    }

    removeAvatar() {
        this.croppedImage = undefined;
        this.imageChangedEvent = undefined;
        this.avatarInput.nativeElement.value = '';
    }

    updateAvatar() {
        this.userService
            .updateAvatar(this.croppedImage ?? '')
            .then(data => {
                this.user!.avatar = data.avatar;
                this.user!.avatarUrl = data.url ? data.url + '?time=' + new Date().getTime() : undefined;

                this.avatarDialog.close();
                this.messageService.addMessage(this.translate.instant('message.user.avatar.update.success'));
            })
            .catch(e => {
                this.messageService.addMessage(e, { type: MessageType.error });
            });
    }
}
