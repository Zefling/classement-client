import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Subject } from 'rxjs';

import { FileHandle, FileString } from '../interface';


const typesImage: string[] = ['image/png', 'image/gif', 'image/jpeg', 'image/webp'];

@Injectable({ providedIn: 'root' })
export class GlobalService {
    readonly onForceExit = new Subject<string | undefined>();

    readonly onFileLoaded = new Subject<FileString>();

    withChange = false;

    constructor(private sanitizer: DomSanitizer) {}

    forceExit(route: string | undefined) {
        this.onForceExit.next(route);
    }

    addFiles(files: FileList) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
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

    private _format(file: FileHandle) {
        const url = file.target?.result ? String(file.target?.result) : undefined;
        if (url) {
            console.log('Add file:', file.file.name);
            this.onFileLoaded.next({
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
