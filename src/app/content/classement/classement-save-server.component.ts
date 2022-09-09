import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { Subscription } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog.component';
import { MessageService, MessageType } from 'src/app/components/info-messages.component';
import { Classement, FileString, FormatedGroup, Options } from 'src/app/interface';
import { APIClassementService, UploadProgress } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';

import { categories } from './classement-default';


@Component({
    selector: 'classement-save-server',
    templateUrl: './classement-save-server.component.html',
    styleUrls: ['./classement-save-server.component.scss'],
})
export class ClassementSaveServerComponent implements OnDestroy {
    @Input()
    classement?: Classement;

    @Input()
    groups?: FormatedGroup[];

    @Input()
    list?: FileString[];

    @Input()
    options?: Options;

    @Input()
    dialog?: DialogComponent;

    @Output()
    save = new EventEmitter<Classement>();

    update = false;

    categories = categories;

    @ViewChild('bannerInput') bannerInput!: ElementRef<HTMLInputElement>;
    @ViewChild('imageCropper') imageCropper!: ImageCropperComponent;

    imageChangedEvent: any = '';
    croppedImage?: string;

    hidden = false;
    loading = false;
    progress?: UploadProgress;

    showError: string[] = [];

    private _sub: Subscription[] = [];

    constructor(
        private userService: APIUserService,
        private classementService: APIClassementService,
        private messageService: MessageService,
        private translate: TranslateService,
    ) {
        this.userService.loggedStatus().then(() => {
            if (this.userService.logged) {
                if (this.userService.user!.username === this.classement?.user) {
                    this.update = true;
                }
            } else {
                this.dialog?.close();
            }
        });

        if (this.classement?.hidden) {
            this.hidden = this.classement?.hidden;
        }

        this._sub.push(
            this.classementService.progressValue.subscribe(value => {
                if (this.loading) {
                    this.progress = value;
                }
            }),
        );
    }

    ngOnDestroy() {
        this._sub.forEach(e => e.unsubscribe());
    }

    cancel() {
        this.dialog?.close();
    }

    validate() {
        this.showError = [];

        const sameUserEdit = this.userService.user?.username === this.classement?.user;

        // format data for server save
        const classement: Classement = {
            rankingId: sameUserEdit ? this.classement?.rankingId ?? null : null,
            parendId: sameUserEdit
                ? this.classement?.parentId ?? this.classement?.templateId ?? null
                : this.classement?.rankingId ?? null,
            templateId: this.classement?.templateId ?? null,
            localId: this.classement?.localId || null,
            name: this.options?.title?.trim(),
            category: this.classement?.category ?? this.options?.category,
            data: { list: this.list, groups: this.groups, options: this.options, name: this.options?.title },
            banner: this.croppedImage || this.classement?.banner,
            hidden: this.hidden ?? this.classement?.hidden ?? false,
        } as any;

        if (!classement.name) {
            this.showError.push(this.translate.instant('error.classement.name.empty'));
        }

        if (!classement.category) {
            this.showError.push(this.translate.instant('error.classement.category.empty'));
        }

        if (!classement.banner) {
            this.showError.push(this.translate.instant('error.classement.banner.empty'));
        }

        if (!this.showError.length) {
            this.loading = true;
            this.progress = undefined;
            this.classementService
                .saveClassement(classement)
                .then(classementSave => {
                    this.save.emit(classementSave);
                    this.userService.updateClassement(classementSave);
                    this.messageService.addMessage(this.translate.instant('message.server.save.success'));
                    this.cancel();
                })
                .catch(e => {
                    this.messageService.addMessage(e, { type: MessageType.error });
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }

    resetBanner() {
        this.croppedImage = undefined;
        this.imageChangedEvent = undefined;
        this.bannerInput.nativeElement.value = '';
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    async imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64!;
    }

    imageLoaded(image: LoadedImage) {
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
}
