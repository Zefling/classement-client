import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { Data, FileHandle, FileStream, FileString, FormatedGroup } from '../interface';


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

    fixImageSize(groups: FormatedGroup[], list: FileString[]) {
        list.forEach(item => {
            this._fixImage(item);
        });
        groups.forEach(group =>
            group.list.forEach(item => {
                this._fixImage(item);
            }),
        );
    }

    private _fixImage(item: FileString) {
        if (item.type.startsWith('image') && !item.width) {
            this._imageDimensions(item.url!)
                .then(size => {
                    item.width = size.width;
                    item.height = size.height;
                })
                .catch(e => console.log('Error file:', item.name, e));
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

    private _imageDimensions(file: File | string): Promise<{ width: number; height: number }> {
        return new Promise<{ width: number; height: number }>((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                const { naturalWidth: width, naturalHeight: height } = img;
                resolve({ width, height });
            };

            img.onerror = () => {
                reject('There was some problem with the image.');
            };

            img.src = typeof file === 'string' ? file : URL.createObjectURL(file);
        });
    }
}
