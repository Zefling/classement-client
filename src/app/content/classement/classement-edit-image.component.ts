import { ChangeDetectorRef, Component, DoCheck, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { FileHandle, FileString } from 'src/app/interface';
import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'classement-edit-image',
    templateUrl: './classement-edit-image.component.html',
    styleUrls: ['./classement-edit-image.component.scss'],
})
export class ClassementEditImageComponent {
    @ViewChild('dialogInfo') dialogInfo!: DialogComponent;
    @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
    @ViewChild('imageCropper') imageCropper!: ImageCropperComponent;

    @Input() currentTile?: FileString;

    imageChangedEvent?: Event;
    croppedImage?: string;

    _open = false;

    data?: string;

    constructor(private cd: ChangeDetectorRef, private global: GlobalService) {}

    open() {
        this.dialogInfo.open();
        this._open = true;
    }

    close() {
        this.dialogInfo.close();
        this._open = false;
    }

    detectChanges() {
        this.cd.detectChanges();
    }

    resetBanner() {
        this.croppedImage = undefined;
        this.imageChangedEvent = undefined;
        this.imageInput.nativeElement.value = '';
    }

    fileChangeEvent(event: Event): void {
        this.imageChangedEvent = event;
    }

    fileChange(event: FileHandle | string) {
        if ((event as FileHandle).target) {
            this.data = (event as FileHandle).target?.result as string;
        }
    }

    async imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64!;
    }

    async update() {
        if (this.croppedImage) {
            this.currentTile!.url = this.croppedImage;
            this.currentTile!.realSize = this.croppedImage.length;
            this.currentTile!.size = this.croppedImage.length;
            this.currentTile!.type = 'image/webp';

            const image = await this.global.imageDimensions(this.croppedImage);
            this.currentTile!.height = image.height;
            this.currentTile!.width = image.width;
        }
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
