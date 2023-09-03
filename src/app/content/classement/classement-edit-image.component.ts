import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    Host,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
} from '@angular/core';

import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { Subject, debounceTime } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { FileHandle, FileString } from 'src/app/interface/interface';
import { GlobalService } from 'src/app/services/global.service';
import { Utils } from 'src/app/tools/utils';

import { ClassementEditComponent } from './classement-edit.component';

const formula = /^\s*\d+(\.\d*)?\s*([/:]\s*\d+(\.\d*)?)?\s*$/;

@Component({
    selector: 'classement-edit-image',
    templateUrl: './classement-edit-image.component.html',
    styleUrls: ['./classement-edit-image.component.scss'],
})
export class ClassementEditImageComponent implements OnChanges {
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

    colorList?: Set<string>;

    private _detectChange = new Subject<void>();

    constructor(
        private readonly cd: ChangeDetectorRef,
        private readonly global: GlobalService,
        @Host() private readonly editor: ClassementEditComponent,
    ) {
        this._detectChange.pipe(debounceTime(10)).subscribe(() => {
            this.cd.detectChanges();
            this.globalChange();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['currentTile']) {
            // list colors
            const colors = new Set<string>();
            this.editor.list.forEach(e => (e.bgColor ? colors.add(e.bgColor) : null));
            this.editor.groups.forEach(e => e.list.forEach(f => (f.bgColor ? colors.add(f.bgColor) : null)));
            this.colorList = colors;
        }
    }

    open() {
        this.dialogInfo.open();
        this._open = true;
    }

    close() {
        this.dialogInfo.close();
        this._open = false;
    }

    detectChanges() {
        this._detectChange.next();
    }

    globalChange() {
        this.global.withChange = true;
    }

    changeRatio(mode: number, aspectRatio: number | string = 0) {
        this.mode = mode;
        const aspectRatioValue =
            typeof aspectRatio === 'string' && aspectRatio.match(formula)
                ? +(eval(aspectRatio.replace(':', '/')) || 0)
                : aspectRatio;
        this.aspectRatio = isNaN(aspectRatioValue as number)
            ? 0
            : parseFloat(`${aspectRatioValue}`.replace('-', '') || '0');
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
        if (event.blob) {
            this.croppedImage = await Utils.blobToBase64(event.blob);
        }
    }

    async update() {
        if (this.croppedImage) {
            const tile = this.currentTile!;
            setTimeout(() => {
                tile.url = this.croppedImage;
            });
            tile.realSize = this.croppedImage.length;
            tile.size = this.croppedImage.length;
            tile.type = 'image/webp';

            const image = await this.global.imageDimensions(this.croppedImage);
            tile.height = image.height;
            tile.width = image.width;

            this.global.onImageUpdate.next();
            this.globalChange();
        }
    }

    imageLoaded(_image?: LoadedImage) {
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
}
