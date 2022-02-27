import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { FileString } from '../interface';


export interface FileHandle {
    file: File;
    url: SafeUrl;
    target?: FileReader | null;
}

const typesImage: string[] = ['image/png', 'image/gif', 'image/jpeg', 'image/webp'];

@Directive({ selector: '[drop-image]' })
export class DropImageDirective {
    @HostBinding('class.drop-image-zone') background = false;

    @Output() fileLoaded = new EventEmitter<FileString>();

    constructor(private sanitizer: DomSanitizer) {}

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
            for (let i = 0; i < evt.dataTransfer.files.length; i++) {
                const file = evt.dataTransfer.files[i];
                if (typesImage.includes(file.type)) {
                    const data: FileHandle = {
                        file,
                        url: file.type === this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file)),
                    };

                    let reader = new FileReader();
                    reader.onload = (ev: ProgressEvent<FileReader>) => {
                        data.target = ev.target;
                    };
                    reader.onloadend = (ev: ProgressEvent<FileReader>) => {
                        this._format(data);
                    };
                    reader.readAsDataURL(data.file);
                }
            }
        }
        evt.preventDefault();
        evt.stopPropagation();
    }

    private _format(file: FileHandle) {
        const url = file.target?.result ? String(file.target?.result) : undefined;
        if (url) {
            console.log('Add file:', file.file.name);
            this.fileLoaded.emit({
                name: file.file.name,
                url: url,
                size: url.length,
                realSize: file.file.size,
                type: file.file.type,
                date: file.file.lastModified,
            });
        } else {
            console.log('Error file:', file.file.name);
        }
    }
}
