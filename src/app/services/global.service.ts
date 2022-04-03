import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { Data, FileHandle, FileStream } from '../interface';


export enum TypeFile {
    image = 'image',
    json = 'json',
}

export const typesMine: { [key: string]: string[] } = {
    image: ['image/png', 'image/gif', 'image/jpeg', 'image/webp'],
    json: ['application/json'],
};

@Injectable({ providedIn: 'root' })
export class GlobalService {
    readonly onForceExit = new Subject<string | undefined>();

    readonly onFileLoaded = new Subject<FileStream>();

    withChange = false;

    lang!: string;

    jsonTmp?: Data;

    forceExit(route: string | undefined) {
        this.onForceExit.next(route);
    }

    addFiles(files: FileList, filter: TypeFile) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (typesMine[filter].includes(file.type)) {
                const data: FileHandle = {
                    file,
                };

                let reader = new FileReader();
                reader.onload = (ev: ProgressEvent<FileReader>) => {
                    data.target = ev.target;
                };
                reader.onloadend = (_ev: ProgressEvent<FileReader>) => {
                    this._format(data, filter);
                };
                reader.readAsDataURL(data.file);
            }
        }
    }

    private _format(file: FileHandle, filter: TypeFile) {
        const url = file.target?.result ? String(file.target?.result) : undefined;
        if (url) {
            console.log('Add file:', file.file.name);
            this.onFileLoaded.next({
                filter,
                file: {
                    name: file.file.name,
                    url: url,
                    size: url.length,
                    realSize: file.file.size,
                    type: file.file.type,
                    date: file.file.lastModified,
                },
            });
        } else {
            console.log('Error file:', file.file.name);
        }
    }
}
