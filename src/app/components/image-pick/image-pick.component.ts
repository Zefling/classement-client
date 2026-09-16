import { Component, ElementRef, inject, input, linkedSignal, output, viewChild } from '@angular/core';

import { Logger, LoggerLevel, MagmaDialog, blobToBase64 } from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';

import { DropImageDirective } from '../../directives/drop-image.directive';
import { FileHandle } from '../../interface/interface';

const formula = /^\s*\d+(\.\d*)?\s*([/:]\s*\d+(\.\d*)?)?\s*$/;

@Component({
    selector: 'image-pick',
    templateUrl: './image-pick.component.html',
    styleUrls: ['./image-pick.component.scss'],
    imports: [MagmaDialog, ImageCropperComponent, TranslocoPipe, DropImageDirective],
})
export class ImagePickComponent {
    private readonly logger = inject(Logger);

    dialogImageEdit = viewChild.required<MagmaDialog>('dialogImageEdit');
    bannerInput = viewChild<ElementRef<HTMLInputElement>>('bannerInput');
    ratioInput = viewChild.required<ElementRef<HTMLInputElement>>('ratioInput');
    imageCropper = viewChild.required<ImageCropperComponent>('imageCropper');

    /** Current data URL passed by the parent */
    value = input<string | undefined>();

    /** Label displayed above the control */
    label = input<string>('');

    /** Emits the new cropped data URL on confirm, or undefined on remove */
    valueChange = output<string | undefined>();

    /**
     * Local signal derived from value() — updated both when the parent pushes
     * a new value AND when we confirm a crop internally. This is what the
     * template reads so the preview updates immediately in both cases.
     */
    currentValue = linkedSignal(() => this.value());

    imageChangedEvent?: Event;
    croppedImage?: string;
    data?: string;

    maintainAspectRatio = false;
    aspectRatio = 0;
    mode = 0;

    // ── public API called from template ──────────────────────────────────────

    removeImage(): void {
        this.currentValue.set(undefined);
        this.valueChange.emit(undefined);
    }

    openEdit(): void {
        this.croppedImage = this.data = this.currentValue();
        this.dialogImageEdit().open();
    }

    closeEdit(): void {
        this.dialogImageEdit().close();
        this.resetBanner();
    }

    updateAndCloseEdit(): void {
        if (this.croppedImage) {
            this.currentValue.set(this.croppedImage);
            this.valueChange.emit(this.croppedImage);
        }
        this.closeEdit();
    }

    // ── shared crop logic (same as classement-edit-image) ────────────────────

    changeRatio(mode: number, aspectRatio: number | string = 0): void {
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

    resetBanner(): void {
        if (this.bannerInput()) {
            this.bannerInput()!.nativeElement.value = '';
        }
        this.croppedImage = undefined;
        this.imageChangedEvent = undefined;
        this.data = '';
    }

    async fileChangeEvent(event: Event): Promise<void> {
        this.imageChangedEvent = event;
        this.data = await blobToBase64((event as any).target.files[0]);
    }

    fileChange(event: FileHandle | string): void {
        if ((event as FileHandle).target) {
            this.data = (event as FileHandle).target?.result as string;
        }
    }

    async imageCropped(event: ImageCroppedEvent): Promise<void> {
        if (event.blob) {
            this.croppedImage = await blobToBase64(event.blob);
        }
    }

    imageLoaded(_image?: LoadedImage): void {
        // show cropper
        setTimeout(() => {
            // fix init position for the cropper
            window.dispatchEvent(new Event('resize'));
        }, 500);
    }

    cropperReady(): void {
        // cropper ready
        this.logger.log('Cropper is ready', LoggerLevel.info);
    }

    loadImageFailed(): void {
        // show message
        this.logger.log('Cropper load image failed !!', LoggerLevel.warn);
    }
}
