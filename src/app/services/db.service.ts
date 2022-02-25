import { Injectable } from '@angular/core';

import { FileHandle } from '../directives/drop-image.directive';
import { Data, FileString, FormatedData } from '../interface';


@Injectable({ providedIn: 'root' })
export class DBService {
    private _db!: IDBDatabase;

    getLocalList(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._getDB().then(db => {});
        });
    }

    saveLocal(data: Data): Promise<string | undefined> {
        return new Promise((resolve, reject) => {
            this.formatData(data).then(formatData => {
                this._getDB()
                    .then(db => this._saveInfo(db, formatData))
                    .then(db => this._saveData(db, formatData))
                    .then(__ => resolve(formatData.infos.id))
                    .catch(_ => reject());
            });
        });
    }

    async formatData(data: Data): Promise<FormatedData> {
        const id = data.id || (await this.digestMessage(`${new Date()}`));
        return {
            infos: {
                id,
                options: {
                    title: data.options.title,
                    category: data.options.category,
                    itemWidth: data.options.itemWidth,
                    itemHeight: data.options.itemHeight,
                    itemPadding: data.options.itemPadding,
                },
                date: `${new Date()}`,
                groupsLenght: data.groups?.length || 0,
                listLenght: data.list?.length || 0,
            },
            data: {
                id,
                groups: data.groups.map(e => {
                    return {
                        bgColor: e.bgColor,
                        txtColor: e.txtColor,
                        name: e.name,
                        list: e.list.map(f => this.fileToString(f)),
                    };
                }),
                list: data.list.map(e => this.fileToString(e)),
            },
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

    private _saveInfo(db: IDBDatabase, formatData: FormatedData): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            console.log('Save Infos');
            const transactionInfos = db.transaction(['classementInfos'], 'readwrite');

            transactionInfos.onerror = ev => {
                console.error('Infos: An error has occurred!', transactionInfos?.error?.message);
                reject();
            };
            transactionInfos.oncomplete = ev => {
                console.log('Infos added successfully!');
                resolve(db);
            };

            transactionInfos.objectStore('classementInfos').add(formatData.infos, formatData.infos.id);
        });
    }

    private _saveData(db: IDBDatabase, formatData: FormatedData): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            console.log('Save Data');
            const transactionData = db.transaction(['classementData'], 'readwrite');

            transactionData.onerror = ev => {
                console.error('Data: An error has occurred!', transactionData?.error?.message);
                reject();
            };
            transactionData.oncomplete = ev => {
                console.log('Data added successfully!');
                resolve(db);
            };

            transactionData.objectStore('classementData').add(formatData.data, formatData.data.id);
        });
    }

    private _getDB(): Promise<IDBDatabase> {
        return new Promise<IDBDatabase>((resolve, reject) => {
            if (this._db) {
                resolve(this._db);
            } else {
                const dbReq = indexedDB.open('classementDB', 1);

                dbReq.onerror = () => {
                    console.error(dbReq.error);
                    reject();
                };

                dbReq.onupgradeneeded = () => {
                    console.log('Upgrade DB');
                    dbReq.result.createObjectStore('classementInfos').createIndex('infos', 'infos', {
                        unique: true,
                    });
                    dbReq.result.createObjectStore('classementData').createIndex('data', 'data', {
                        unique: true,
                    });
                };

                dbReq.onsuccess = () => {
                    console.log('DB update successfully ');
                    this._db = dbReq.result;
                    resolve(this._db);
                };
            }
        });
    }
}
