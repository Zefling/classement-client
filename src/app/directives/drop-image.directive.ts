import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

import { FileHandle } from '../interface';
import { GlobalService, TypeFile, typesMine } from '../services/global.service';

@Directive({ selector: '[drop-image]' })
export class DropImageDirective {
    @HostBinding('class.drop-image-zone') background = false;

    @Input() mode: 'global' | 'local' = 'global';

    @Input() allowText = true;

    @Input() disabled = false;

    @Output() file = new EventEmitter<FileHandle | string>();

    constructor(private readonly globalService: GlobalService) {}

    @HostListener('dragover', ['$event'])
    onDragOver(evt: DragEvent): void {
        evt.preventDefault();
        if (!this.disabled) {
            this.background = true;
        }
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        if (!this.disabled) {
            this.background = false;
        }
    }

    @HostListener('drop', ['$event'])
    public onDrop(event: DragEvent): void {
        if (!this.disabled) {
            this.background = false;
            if (this.mode === 'global') {
                if (event.dataTransfer?.files?.length) {
                    this.globalService.addFiles(event.dataTransfer.files, TypeFile.image);
                } else if (this.allowText && event.dataTransfer?.getData('text')) {
                    this.globalService.addTexts(event.dataTransfer?.getData('text'));
                }
            } else if (this.mode === 'local') {
                if (event.dataTransfer?.files?.length) {
                    this.addFile(event.dataTransfer.files, TypeFile.image).then(file => {
                        this.file.emit(file);
                    });
                }
            }
        }

        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener('window:paste', ['$event'])
    onCtrlV(event: ClipboardEvent) {
        if (!this.disabled) {
            if (this.mode === 'global') {
                if (event.clipboardData?.files?.length) {
                    this.globalService.addFiles(event.clipboardData?.files, TypeFile.image);
                }
                if (
                    this.allowText &&
                    event.clipboardData?.getData('text') &&
                    !['INPUT', 'TEXTAREA'].includes((event.target as HTMLInputElement).tagName)
                ) {
                    this.globalService.addTexts(event.clipboardData?.getData('text'));
                }
            } else if (this.mode === 'local') {
                if (event.clipboardData?.files?.length) {
                    this.addFile(event.clipboardData.files, TypeFile.image).then(file => {
                        this.file.emit(file);
                    });
                }
            }
        }
    }

    /**
     * only one file
     */
    private addFile(files: FileList, filter: TypeFile): Promise<FileHandle> {
        return new Promise<FileHandle>(resolve => {
            for (let i = 0; i < files.length; i++) {
                const file = files[0];

                if (typesMine[filter].includes(file.type)) {
                    const data: FileHandle = {
                        file,
                    };

                    let reader = new FileReader();
                    reader.onload = (ev: ProgressEvent<FileReader>) => {
                        data.target = ev.target;
                    };
                    reader.onloadend = (_ev: ProgressEvent<FileReader>) => {
                        resolve(data);
                    };
                    reader.readAsDataURL(data.file);

                    break;
                }
            }
        });
    }
}
