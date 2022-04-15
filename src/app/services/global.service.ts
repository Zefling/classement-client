import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { Data, FileHandle, FileStream } from '../interface';


export enum TypeFile {
    image = 'image',
    json = 'json',
    text = 'text',
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

    addTexts(text: string) {
        const lines = text.split('\n');
        for (const line of lines) {
            const trimString = line.trim();
            this.onFileLoaded.next({
                filter: TypeFile.text,
                file: {
                    name: '',
                    url: '',
                    size: trimString.length,
                    realSize: trimString.length,
                    type: 'plain/text',
                    date: new Date().getTime(),
                    title: trimString,
                    width: 150,
                },
            });
        }
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
            this._imageDimensions(file.file)
                .then(size => {
                    this.onFileLoaded.next({
                        filter,
                        file: {
                            name: file.file.name,
                            url: url,
                            size: url.length,
                            realSize: file.file.size,
                            type: file.file.type,
                            date: file.file.lastModified,
                            title: '',
                            width: size.width,
                            height: size.height,
                        },
                    });
                })
                .catch(e => console.log('Error file:', file.file.name, e));
        } else {
            console.log('Error file:', file.file.name);
        }
    }

    // helper to get dimensions of an image
    private _imageDimensions(file: File) {
        return new Promise<{ width: number; height: number }>((resolve, reject) => {
            const img = new Image();

            // the following handler will fire after the successful loading of the image
            img.onload = () => {
                const { naturalWidth: width, naturalHeight: height } = img;
                resolve({ width, height });
            };

            // and this handler will fire if there was an error with the image (like if it's not really an image or a
            // corrupted one)
            img.onerror = () => {
                reject('There was some problem with the image.');
            };

            img.src = URL.createObjectURL(file);
        });
    }
}
