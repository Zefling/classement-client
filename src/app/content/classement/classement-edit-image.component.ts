import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnChanges,
    SimpleChanges,
    inject,
    input,
    output,
    viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
    MagmaDialog,
    MagmaInput,
    MagmaInputColor,
    MagmaInputElement,
    MagmaInputText,
    MagmaInputTextarea,
    MagmaStopPropagationDirective,
    blobToBase64,
} from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { Subject, debounceTime } from 'rxjs';

import { FileHandle, FileString, Options } from 'src/app/interface/interface';
import { GlobalService } from 'src/app/services/global.service';
import { Logger, LoggerLevel } from 'src/app/services/logger';

import { ClassementEditComponent } from './classement-edit.component';

import { DropImageDirective } from '../../directives/drop-image.directive';

const formula = /^\s*\d+(\.\d*)?\s*([/:]\s*\d+(\.\d*)?)?\s*$/;

@Component({
    selector: 'classement-edit-image',
    templateUrl: './classement-edit-image.component.html',
    styleUrls: ['./classement-edit-image.component.scss'],
    imports: [
        MagmaDialog,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaInputTextarea,
        MagmaInputColor,
        MagmaStopPropagationDirective,
        FormsModule,
        DropImageDirective,
        ImageCropperComponent,
        TranslocoPipe,
    ],
})
export class ClassementEditImageComponent implements OnChanges {
    private readonly cd = inject(ChangeDetectorRef);
    private readonly global = inject(GlobalService);
    private readonly logger = inject(Logger);
    private readonly editor = inject(ClassementEditComponent, { host: true });

    // viewChild

    dialogInfo = viewChild.required<MagmaDialog>('dialogInfo');
    dialogImageEdit = viewChild.required<MagmaDialog>('dialogImageEdit');
    bannerInput = viewChild.required<ElementRef<HTMLInputElement>>('bannerInput');
    ratioInput = viewChild.required<ElementRef<HTMLInputElement>>('ratioInput');
    imageCropper = viewChild.required<ImageCropperComponent>('imageCropper');

    // input

    currentTile = input<FileString>();

    // output

    deleteCurrent = output<void>();

    imageChangedEvent?: Event;
    croppedImage?: string;

    _open = false;

    data?: string;

    maintainAspectRatio = false;
    aspectRatio = 0;
    mode = 0;

    colorListBg?: Set<string>;
    colorListTxt?: Set<string>;

    _options?: Options;

    private _detectChange = new Subject<void>();

    constructor() {
        this._detectChange.pipe(debounceTime(10)).subscribe(() => {
            this.cd.detectChanges();
            this.globalChange();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['currentTile']) {
            // list colors background
            const bgColors = new Set<string>();
            this.editor.list.forEach(e => (e?.bgColor ? bgColors.add(e.bgColor) : null));
            this.editor.groups.forEach(e => e.list.forEach(f => (f?.bgColor ? bgColors.add(f.bgColor) : null)));
            this.colorListBg = bgColors;

            // list colors text
            const txtColors = new Set<string>();
            this.editor.list.forEach(e => (e?.txtColor ? txtColors.add(e.txtColor) : null));
            this.editor.groups.forEach(e => e.list.forEach(f => (f?.txtColor ? txtColors.add(f.txtColor) : null)));
            this.colorListTxt = txtColors;
        }
        this._options ??= this.editor.options;
    }

    open() {
        this.dialogInfo().open();
        this._open = true;
    }

    close() {
        this.dialogInfo().close();
        this._open = false;
    }

    openEdit() {
        this.dialogImageEdit().open();
    }

    closeEdit() {
        this.dialogImageEdit().close();
        this.resetBanner();
    }

    delete() {
        this.deleteCurrent.emit();
        this.close();
    }

    detectChanges() {
        this._detectChange.next();
    }

    globalChange() {
        this.editor.globalChange();
    }

    /**
     * only for iceberg & axis
     */
    tileZIndex(position: 'top' | 'up' | 'down' | 'bottom') {
        const list = this.editor.groups[0].list;
        const index = list.findIndex(e => e?.id === this.currentTile()!.id);
        const item = list.splice(index, 1)[0];

        switch (position) {
            case 'top':
                list.push(item);
                break;
            case 'up':
                list.splice(index + 1, 0, item);
                break;
            case 'down':
                list.splice(index - 1, 0, item);
                break;
            case 'bottom':
                list.unshift(item);
                break;
        }
    }

    changeRatio(mode: number, aspectRatio: number | string = 0) {
        this.mode = mode;
        const aspectRatioValue =
            typeof aspectRatio === 'string' && aspectRatio.match(formula)
                ? this.evalRatio(aspectRatio.replace(':', '/'))
                : aspectRatio;
        this.aspectRatio = isNaN(aspectRatioValue as number)
            ? 0
            : parseFloat(`${aspectRatioValue}`.replace('-', '') || '0');
        this.maintainAspectRatio = this.aspectRatio !== 0;

        if (mode !== 99) {
            this.ratioInput().nativeElement.value = `${aspectRatio}`;
        }

        this.imageLoaded();
    }

    private evalRatio(aspectRatio: string): number {
        const [a, b] = aspectRatio.split('/');
        return b.trim() ? +a.trim() / +b.trim() : 0;
    }

    resetBanner() {
        this.bannerInput().nativeElement.value = '';
        this.croppedImage = undefined;
        this.imageChangedEvent = undefined;
        this.data = '';
    }

    async fileChangeEvent(event: Event) {
        this.imageChangedEvent = event;
        this.data = await blobToBase64((event as any).target.files[0]);
    }

    fileChange(event: FileHandle | string) {
        if ((event as FileHandle).target) {
            this.data = (event as FileHandle).target?.result as string;
        }
    }

    async imageCropped(event: ImageCroppedEvent) {
        if (event.blob) {
            this.croppedImage = await blobToBase64(event.blob);
        }
    }

    async updateAndCloseEdit() {
        if (this.croppedImage) {
            const tile = this.currentTile()!;
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
        this.closeEdit();
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
        this.logger.log('Cropper is ready', LoggerLevel.info);
    }

    loadImageFailed() {
        // show message
        this.logger.log('Cropper load image failed !!', LoggerLevel.warn);
    }
}
