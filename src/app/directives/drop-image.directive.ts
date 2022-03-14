import { Directive, HostBinding, HostListener } from '@angular/core';

import { GlobalService } from '../services/global.service';


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
    public onDrop(evt: DragEvent): void {
        this.background = false;

        if (evt.dataTransfer?.files?.length) {
            this.globalService.addFiles(evt.dataTransfer.files);
        }

        evt.preventDefault();
        evt.stopPropagation();
    }
}
