import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

import { DialogComponent } from 'src/app/components/dialog.component';
import { MessageService, MessageType } from 'src/app/components/info-messages.component';
import { Classement, FileString, FormatedGroup, Options } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';

import { categories } from './classement-default';


@Component({
    selector: 'classement-save-server',
    templateUrl: './classement-save-server.component.html',
    styleUrls: ['./classement-save-server.component.scss'],
})
export class ClassementSaveServerComponent {
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

    imageChangedEvent: any = '';
    croppedImage?: string;

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
    }

    cancel() {
        this.dialog?.close();
    }

    validate() {
        // format data
        const classement = {
            // save only for save user
            rankingId:
                this.userService.user?.username === this.classement?.user ? this.classement?.rankingId ?? null : null,
            templateId: this.classement?.templateId || null,
            localId: this.classement?.localId || null,
            name: this.options?.title,
            category: this.classement?.category ?? this.options?.category,
            data: { list: this.list, groups: this.groups, options: this.options, name: this.options?.title },
            banner: this.croppedImage || this.classement?.banner,
        } as any;

        console.log('classement', classement);

        this.classementService
            .saveClassement(classement)
            .then(classementSave => {
                this.save.emit(classementSave);
                this.userService.updateClassement(classementSave);
                this.messageService.addMessage(this.translate.instant('message.server.save.success'));
                this.cancel();
            })
            .catch(e => {
                this.messageService.addMessage(e, MessageType.error);
            });
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
    }

    cropperReady() {
        // cropper ready
    }

    loadImageFailed() {
        // show message
    }
}
