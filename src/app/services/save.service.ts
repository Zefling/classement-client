import { Injectable } from '@angular/core';

import { FileHandle } from '../directives/drop-image.directive';
import { Data, FileString, FormatedData } from '../interface';


@Injectable({ providedIn: 'root' })
export class SaveService {
    saveLocal(data: Data): Promise<void> {
        return new Promise((resolve, reject) => {
            this.formatData(data).then(formatData => {
                const dbReq = indexedDB.open('classementDB', 1);

                dbReq.onerror = () => {
                    console.error(dbReq.error);
                    reject();
                };

                dbReq.onupgradeneeded = () => {
                    console.log('Upgrade DB');

                    const db = dbReq.result;
                    var objectStore = db.createObjectStore('classement');
                    objectStore.createIndex('classement', 'classement', { unique: false });
                };

                dbReq.onsuccess = () => {
                    console.log('DB update successfully ');
                    const db = dbReq.result;
                    const transaction = db.transaction(['classement'], 'readwrite');

                    transaction.onerror = ev => {
                        console.error('An error has occurred!', transaction?.error?.message);
                        reject();
                    };
                    transaction.oncomplete = ev => {
                        console.log('Data added successfully! ');
                        resolve();
                    };
                    console.log('transaction');

                    console.log('formatData');
                    const objectStore = transaction.objectStore('classement');

                    console.log('formatData', formatData);
                    const request = objectStore.add({ classement: formatData }, formatData.id);
                    console.log('request', request);
                };
            });
        });
    }

    async formatData(data: Data): Promise<FormatedData> {
        return {
            options: {
                title: data.options.title,
                category: data.options.category,
                itemWidth: data.options.itemWidth,
                itemHeight: data.options.itemHeight,
                itemPadding: data.options.itemPadding,
            },
            id: data.id || (await this.digestMessage(`${new Date()}`)),
            date: `${new Date()}`,
            groups: data.groups.map(e => {
                return {
                    bgColor: e.bgColor,
                    txtColor: e.txtColor,
                    name: e.name,
                    list: e.list.map(f => this.fileToString(f)),
                };
            }),
            list: data.list.map(e => this.fileToString(e)),
        };
    }

    fileToString(file: FileHandle): FileString {
        return {
            url: file.target?.result ? String(file.target?.result) : undefined,
            name: file.file.name,
        };
    }

    async digestMessage(message?: string): Promise<string> {
        const hashBuffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(message));
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
}
