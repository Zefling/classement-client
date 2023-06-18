import { Injectable } from '@angular/core';

import Pica from 'pica';

import { FileHandle, FileString, FormatedGroup, ModeNames, OptimisedFile } from '../interface';

@Injectable({ providedIn: 'root' })
export class OptimiseImageService {
    resize(
        sourceFile: FileString,
        maxWidth: number,
        maxHeight: number,
        mimeType: string = 'image/webp',
    ): Promise<OptimisedFile> {
        return new Promise((resolve, reject) => {
            let canvas: HTMLCanvasElement = document.createElement('canvas');
            let image = new Image();

            image.onload = () => {
                const { width, height } = this.resizeDimension(image.width, image.height, maxWidth, maxHeight);
                canvas.width = width;
                canvas.height = height;
                const pica = new Pica();
                pica.resize(image, canvas)
                    .then(result => pica.toBlob(result, mimeType, 0.9))
                    .then(resizedBlob => {
                        const file = new File([resizedBlob], sourceFile.name, { type: mimeType });
                        const data: FileHandle = {
                            file: file,
                        };

                        let reader = new FileReader();
                        reader.onload = (ev: ProgressEvent<FileReader>) => {
                            data.target = ev.target;
                        };
                        reader.onloadend = (_ev: ProgressEvent<FileReader>) => {
                            if (data.file.size < sourceFile.realSize) {
                                const url = data.target?.result ? String(data.target?.result) : undefined;
                                resolve({
                                    sourceFile,
                                    reduceFile: {
                                        name: sourceFile.name,
                                        url: url,
                                        size: url!.length,
                                        realSize: data.file.size,
                                        type: resizedBlob.type,
                                        date: sourceFile.date,
                                        title: sourceFile.title,
                                        width: width,
                                        height: height,
                                    },
                                    reduce: sourceFile.realSize - data.file.size,
                                });
                            } else {
                                resolve({ sourceFile, reduce: 0 });
                            }
                        };
                        reader.readAsDataURL(data.file);
                    })
                    .catch(error => reject(error));
            };
            image.src = sourceFile.url!;
        });
    }

    size(list?: FileString[], groups?: FormatedGroup[], mode: ModeNames = 'default') {
        let size = 0;
        let files = 0;
        if (list) {
            list.forEach(e => {
                if (e.url?.startsWith('data')) {
                    size += e.realSize;
                    files++;
                }
            });
        }
        if (groups && mode !== 'teams') {
            groups.forEach(f =>
                f?.list.forEach(e => {
                    if (e.url?.startsWith('data')) {
                        size += e.realSize;
                        files++;
                    }
                }),
            );
        }
        return { size, files };
    }

    private resizeDimension(
        widthSource: number,
        heightSource: number,
        widthTarget: number,
        heightTarget: number,
        ratio: boolean = true,
        enlarge: boolean = false,
    ): { width: number; height: number; resize: boolean } {
        let heightTemp = heightSource;
        let widthTemp = widthSource;
        let widthCible = heightSource;
        let heightCible = widthSource;
        let resize = true;

        if (!enlarge && widthTemp <= widthTarget && heightTemp <= heightTarget) {
            widthCible = widthSource;
            heightCible = heightSource;
            resize = false;
        } else if (widthTarget > 0 && heightTarget > 0) {
            if (ratio) {
                if (widthTarget <= widthTemp || heightTarget <= heightTemp) {
                    if (widthTarget / widthTemp > heightTarget / heightTemp) {
                        widthCible = Math.round((widthTemp / heightTemp) * heightTarget);
                        heightCible = heightTarget;
                    } else {
                        widthCible = widthTarget;
                        heightCible = Math.round((heightTemp / widthTemp) * widthTarget);
                    }
                }
            } else {
                widthCible = widthTarget;
                heightCible = heightTarget;
            }
        }
        return { width: widthCible, height: heightCible, resize };
    }
}
