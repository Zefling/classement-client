import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { debounceTime } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MessageService, MessageType } from 'src/app/components/info-messages/info-messages.component';
import { FileHandle, User } from 'src/app/interface';
import { APIUserService } from 'src/app/services/api.user.service';
import { GlobalService } from 'src/app/services/global.service';
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
    @ViewChild('dialogChangeUsername') dialogChangeUsername!: DialogComponent;
    @ViewChild('dialogRemoveProfile') dialogRemoveProfile!: DialogComponent;
    @ViewChild('dialogChangeEmail') dialogChangeEmail!: DialogComponent;

    @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;
    @ViewChild('imageCropper') imageCropper!: ImageCropperComponent;

    changeEmailForm: FormGroup;
    emailOldValid = false;
    emailNewValid = false;

    changeUsernameForm: FormGroup;
    usernameValidity?: boolean;

    imageChangedEvent?: Event;
    imageBase64: string = '';
    croppedImage?: string;

    constructor(
        private readonly router: Router,
        private readonly global: GlobalService,
        userService: APIUserService,
        messageService: MessageService,
        translate: TranslateService,
    ) {
        super(userService, messageService, translate);

        this.updateTitle();

        this.listener.push(
            this.userService.afterLogin.subscribe(() => {
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

        // username

        this.changeUsernameForm = new FormGroup({
            username: new FormControl(''),
        });

        this.changeUsernameForm
            .get('username')
            ?.valueChanges.pipe(debounceTime(500))
            .subscribe(value => {
                const testValue = value?.trim();
                if (value?.trim()) {
                    this.userService
                        .test('username', testValue)
                        .then(test => {
                            this.usernameValidity = !test;
                            this.showError[0] = test
                                ? this.translate.instant(
                                      testValue === this.user?.username
                                          ? 'error.username.same'
                                          : 'error.username.exist',
                                  )
                                : '';
                        })
                        .catch(e => {
                            this.usernameValidity = false;
                            this.showError[0] = e;
                        });
                } else {
                    this.usernameValidity = undefined;
                }
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

    updateTitle() {
        this.global.setTitle('menu.profile');
    }

    changeUsername(): void {
        this.usernameValidity = undefined;
        this.showError = [];
        this.changeUsernameForm.get('username')?.setValue('');
        this.dialogChangeUsername.open();
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

    valideChangeUsername() {
        var value = this.changeUsernameForm.value;

        if (this.usernameValidity) {
            this.userService
                .update('', value.username, 'username')
                .then(() => {
                    this.dialogChangeUsername.close();
                    this.user!.username = value.username;
                    this.messageService.addMessage(this.translate.instant('message.user.username.update.success'));
                })
                .catch(e => {
                    this.messageService.addMessage(e, { type: MessageType.error });
                });
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
        if (event.blob) {
            this.croppedImage = await Utils.blobToBase64(event.blob);
        }
    }

    imageLoaded(_image: LoadedImage) {
        // show cropper

        setTimeout(() => {
            // fix init position for the cropper
            window.dispatchEvent(new Event('resize'));
        }, 500);
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
