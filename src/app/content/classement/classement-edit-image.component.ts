import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { FileHandle, FileString } from 'src/app/interface';
import { GlobalService } from 'src/app/services/global.service';

const formula = /^\s*\d+(\.\d*)?\s*([/:]\s*\d+(\.\d*)?)?\s*$/;

@Component({
    selector: 'classement-edit-image',
    templateUrl: './classement-edit-image.component.html',
    styleUrls: ['./classement-edit-image.component.scss'],
})
export class ClassementEditImageComponent {
    @ViewChild('dialogInfo') dialogInfo!: DialogComponent;
    @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
    @ViewChild('ratioInput') ratioInput!: ElementRef<HTMLInputElement>;
    @ViewChild('imageCropper') imageCropper!: ImageCropperComponent;

    @Input() currentTile?: FileString;

    imageChangedEvent?: Event;
    croppedImage?: string;

    _open = false;

    data?: string;

    maintainAspectRatio = false;
    aspectRatio = 0;
    mode = 0;

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

    changeRatio(mode: number, aspectRatio: number | string = 0) {
        this.mode = mode;
        const aspectRatioValue =
            typeof aspectRatio === 'string' && aspectRatio.match(formula)
                ? +(eval(aspectRatio.replace(':', '/')) || 0)
                : aspectRatio;
        this.aspectRatio = isNaN(aspectRatio as number) ? 0 : parseFloat(`${aspectRatio}`.replace('-', '') || '0');
        this.maintainAspectRatio = this.aspectRatio !== 0;

        if (mode !== 99) {
            this.ratioInput.nativeElement.value = `${aspectRatio}`;
        }

        this.imageLoaded();
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
        setTimeout(() => {
            this.croppedImage = event.base64!;
        });
    }

    async update() {
        if (this.croppedImage) {
            setTimeout(() => {
                this.currentTile!.url = this.croppedImage;
            });
            this.currentTile!.realSize = this.croppedImage.length;
            this.currentTile!.size = this.croppedImage.length;
            this.currentTile!.type = 'image/webp';

            const image = await this.global.imageDimensions(this.croppedImage);
            this.currentTile!.height = image.height;
            this.currentTile!.width = image.width;
        }
    }

    imageLoaded(image?: LoadedImage) {
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
