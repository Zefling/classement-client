import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, inject, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import {
    MagmaDialog,
    MagmaInput,
    MagmaInputElement,
    MagmaInputPassword,
    MagmaInputText,
    MagmaMessageType,
    MagmaMessages,
    MagmaTabsModule,
    blobToBase64,
    testEmail,
} from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { debounceTime } from 'rxjs';

import { ThemeIconComponent } from 'src/app/components/theme-icon/theme-icon.component';
import { FileHandle, Theme, User } from 'src/app/interface/interface';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

import { UserPassword } from './user-password';

import { NavigateResultComponent } from '../../components/navigate-result/navigate-result.component';
import { DropImageDirective } from '../../directives/drop-image.directive';

@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
    imports: [
        RouterLink,
        RouterLinkActive,
        NavigateResultComponent,
        MagmaDialog,
        FormsModule,
        ReactiveFormsModule,
        DropImageDirective,
        ImageCropperComponent,
        DatePipe,
        TranslocoPipe,
        MagmaTabsModule,
        ThemeIconComponent,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaInputPassword,
    ],
})
export class UserProfileComponent extends UserPassword implements OnDestroy {
    private readonly router = inject(Router);
    private readonly global = inject(GlobalService);
    private readonly dbService = inject(DBService);

    user?: User;

    localSizeClassements = 0;
    localThemes?: Theme[];

    listener = Subscriptions.instance();

    avatarDialog = viewChild.required<MagmaDialog>('avatarDialog');
    dialogChangePassword = viewChild.required<MagmaDialog>('dialogChangePassword');
    dialogChangeUsername = viewChild.required<MagmaDialog>('dialogChangeUsername');
    dialogRemoveProfile = viewChild.required<MagmaDialog>('dialogRemoveProfile');
    dialogChangeEmail = viewChild.required<MagmaDialog>('dialogChangeEmail');

    avatarInput = viewChild.required<ElementRef<HTMLInputElement>>('avatarInput');

    changeEmailForm: FormGroup;
    emailOldValid = false;
    emailNewValid = false;

    changeUsernameForm: FormGroup;
    usernameValidity?: boolean;

    imageChangedEvent?: Event;
    imageBase64: string = '';
    croppedImage?: string;

    constructor() {
        const userService = inject(APIUserService);
        const mgMessage = inject(MagmaMessages);
        const translate = inject(TranslocoService);

        super(userService, mgMessage, translate);

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
            this.translate.langChanges$.subscribe(() => {
                this.updateTitle();
            }),
            this.global.onUpdateList.subscribe(() => {
                this.updateLocalListSize();
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
                                ? this.translate.translate(
                                      testValue === this.user?.username
                                          ? 'error.username.yours'
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
            this.emailOldValid = testEmail(value);
            this.showError[0] = value && !this.emailOldValid ? this.translate.translate('error.email.old.invalid') : '';
        });
        this.changeEmailForm
            .get('emailNew')
            ?.valueChanges.pipe(debounceTime(500))
            .subscribe(value => {
                if (testEmail(value)) {
                    this.userService
                        .test('email', value)
                        .then(test => {
                            this.emailNewValid = !test;
                            this.showError[1] = test ? this.translate.translate('error.email.already.used') : '';
                        })
                        .catch(e => {
                            this.emailNewValid = false;
                            this.showError[1] = e;
                        });
                } else if (value) {
                    this.emailNewValid = false;
                    this.showError[1] = this.translate.translate('error.email.new.invalid');
                }
            });

        this.updateLocalListSize();
    }

    updateLocalListSize() {
        this.dbService?.getLocalList().then(e => (this.localSizeClassements = e.length));
        this.dbService?.getLocalAllThemes().then(e => (this.localThemes = e));
    }

    updateTitle() {
        this.global.setTitle('menu.profile');
    }

    changeUsername(): void {
        this.usernameValidity = undefined;
        this.showError = [];
        this.changeUsernameForm.get('username')?.setValue('');
        this.dialogChangeUsername().open();
    }

    changePassword(): void {
        this.showError = [];
        this.changePasswordForm.get('passwordOld')?.setValue('');
        this.changePasswordForm.get('password')?.setValue('');
        this.changePasswordForm.get('password2')?.setValue('');
        this.dialogChangePassword().open();
    }

    changeEmail(): void {
        this.showError = [];
        this.changeEmailForm.get('emailOld')?.setValue('');
        this.changeEmailForm.get('emailNew')?.setValue('');
        this.dialogChangeEmail().open();
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
                    this.dialogChangePassword().close();
                    this.mgMessage.addMessage(this.translate.translate('message.server.update.password.success'));
                })
                .catch(e => {
                    this.mgMessage.addMessage(e, { type: MagmaMessageType.error });
                });
        }
    }

    valideChangeEmail() {
        var value = this.changeEmailForm.value;

        if (this.emailNewValid) {
            this.userService
                .update(value.emailOld, value.emailNew, 'email')
                .then(() => {
                    this.dialogChangePassword().close();
                    this.mgMessage.addMessage(this.translate.translate('message.server.update.password.success'));
                })
                .catch(e => {
                    this.mgMessage.addMessage(e, { type: MagmaMessageType.error });
                });
        } else if (!value.emailOld && !value.emailNew) {
            this.showError[0] = this.translate.translate('error.email.old.invalid');
        }
    }

    valideChangeUsername() {
        var value = this.changeUsernameForm.value;

        if (this.usernameValidity) {
            this.userService
                .update('', value.username, 'username')
                .then(() => {
                    this.dialogChangeUsername().close();
                    this.user!.username = value.username;
                    this.mgMessage.addMessage(this.translate.translate('message.user.username.update.success'));
                })
                .catch(e => {
                    this.mgMessage.addMessage(e, { type: MagmaMessageType.error });
                });
        }
    }

    removeProfile() {
        this.dialogRemoveProfile().open();
    }

    valideRemoveProfile() {
        this.userService
            .remove()
            .then(() => {
                this.userService.reset();
                this.dialogRemoveProfile().close();
                this.mgMessage.addMessage(this.translate.translate('message.user.remove.success'));
                this.router.navigate(['/user/login']);
            })
            .catch(e => {
                this.mgMessage.addMessage(e, { type: MagmaMessageType.error });
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
        this.avatarDialog().open();
    }

    async imageCropped(event: ImageCroppedEvent) {
        if (event.blob) {
            this.croppedImage = await blobToBase64(event.blob);
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
        this.avatarInput().nativeElement.value = '';
    }

    updateAvatar() {
        this.userService
            .updateAvatar(this.croppedImage ?? '')
            .then(data => {
                this.user!.avatar = data.avatar;
                this.user!.avatarUrl = data.url ? data.url + '?time=' + new Date().getTime() : undefined;

                this.avatarDialog().close();
                this.mgMessage.addMessage(this.translate.translate('message.user.avatar.update.success'));
            })
            .catch(e => {
                this.mgMessage.addMessage(e, { type: MagmaMessageType.error });
            });
    }
}
