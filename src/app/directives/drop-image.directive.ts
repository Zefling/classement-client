import { Directive, EventEmitter, HostBinding, HostListener, Output, Sanitizer } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export interface FileHandle {
    file: File;
    url: SafeUrl;
    target?: FileReader | null;
}

@Directive({ selector: '[drop-image]' })
export class DropImageDirective {
    @HostBinding('style.background') background? = '';

    @Output() files = new EventEmitter();

    constructor(private sanitizer: DomSanitizer) {}

    @HostListener('dragover', ['$event'])
    onDragOver(evt: DragEvent): void {
        evt.preventDefault();
        this.background = 'red';
        console.log('A');
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.background = '';
        console.log('B');
    }

    @HostListener('drop', ['$event'])
    public onDrop(evt: DragEvent): void {
        this.background = '';
        console.log('C');

        if (evt.dataTransfer?.files?.length) {
            const files: FileHandle[] = [];

            for (let i = 0; i < evt.dataTransfer.files.length; i++) {
                const file = evt.dataTransfer.files[i];
                const data: FileHandle = {
                    file,
                    url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file)),
                };

                let reader = new FileReader();
                reader.onload = (ev: ProgressEvent<FileReader>) => {
                    data.target = ev.target;
                };
                reader.readAsDataURL(data.file);

                files.push(data);
            }

            if (files.length > 0) {
                this.files.emit(files);
            }
        }
        evt.preventDefault();
        evt.stopPropagation();
    }
}
