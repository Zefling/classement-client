import { Directive, HostBinding, HostListener } from '@angular/core';

import { GlobalService, TypeFile } from '../services/global.service';


@Directive({ selector: '[drop-image]' })
export class DropImageDirective {
    @HostBinding('class.drop-image-zone') background = false;

    constructor(private globalService: GlobalService) {}

    @HostListener('dragover', ['$event'])
    onDragOver(evt: DragEvent): void {
        evt.preventDefault();
        this.background = true;
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.background = false;
    }

    @HostListener('drop', ['$event'])
    public onDrop(event: DragEvent): void {
        this.background = false;

        if (event.dataTransfer?.files?.length) {
            this.globalService.addFiles(event.dataTransfer.files, TypeFile.image);
        } else if (event.dataTransfer?.getData('text')) {
            this.globalService.addTexts(event.dataTransfer?.getData('text'));
        }

        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener('window:paste', ['$event'])
    onCtrlV(event: ClipboardEvent) {
        if (event.clipboardData?.files?.length) {
            this.globalService.addFiles(event.clipboardData?.files, TypeFile.image);
        }
        if (event.clipboardData?.getData('text') && (event.target as HTMLInputElement).tagName !== 'INPUT') {
            this.globalService.addTexts(event.clipboardData?.getData('text'));
        }
    }
}
