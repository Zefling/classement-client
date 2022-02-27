import { Injectable } from '@angular/core';

import { FileHandle } from '../directives/drop-image.directive';
import { Data, FileString, FormatedInfos, FormatedInfosData, IndexedData } from '../interface';


enum Store {
    infos = 'classementInfos',
    data = 'classementData',
}

@Injectable({ providedIn: 'root' })
export class DBService {
    private _db!: IDBDatabase;

    getLocalList(): Promise<FormatedInfos[]> {
        return this._getDB().then(db => this._getInfosList(db));
    }

    delete(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this._getDB()
                .then(db => this._deleteDB(db, Store.infos, id))
                .then(db => this._deleteDB(db, Store.data, id))
                .then(__ => resolve())
                .catch(_ => reject());
        });
    }

    loadLocal(id: string): Promise<FormatedInfosData> {
        const formatData: any = {};
        return new Promise((resolve, reject) => {
            this._getDB()
                .then(db => this._getByIdDB(db, Store.infos, id, formatData, 'infos'))
                .then(db => this._getByIdDB(db, Store.data, id, formatData, 'data'))
                .then(__ => resolve(formatData))
                .catch(_ => reject());
        });
    }

    saveLocal(data: Data): Promise<string | undefined> {
        return new Promise((resolve, reject) => {
            this._formatData(data).then(formatData => {
                this._getDB()
                    .then(db => this._saveDB(db, Store.infos, formatData.infos))
                    .then(db => this._saveDB(db, Store.data, formatData.data))
                    .then(__ => resolve(formatData.infos.id))
                    .catch(_ => reject());
            });
        });
    }

    private async _formatData(data: Data): Promise<FormatedInfosData> {
        const id = data.id || (await this._digestMessage(`${new Date()}`));
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
                        list: e.list.map(f => this._fileToString(f)),
                    };
                }),
                list: data.list.map(e => this._fileToString(e)),
            },
        };
    }

    private async _digestMessage(message?: string): Promise<string> {
        const hashBuffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(message));
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    private _fileToString(file: FileHandle): FileString {
        return {
            url: file.target?.result ? String(file.target?.result) : undefined,
            name: file.file.name,
        };
    }

    private _getInfosList(db: IDBDatabase): Promise<FormatedInfos[]> {
        return new Promise((resolve, reject) => {
            console.log('Read Infos');
            const list = db.transaction([Store.infos], 'readwrite').objectStore(Store.infos).getAll();
            list.onsuccess = function (this: IDBRequest<FormatedInfos[]>) {
                console.log('getInfosList', this.result);
                resolve(this.result);
            };
            list.onerror = () => {
                console.error('getInfosList: An error has occurred!', list?.error?.message);
                reject();
            };
        });
    }

    private _getByIdDB<T>(
        db: IDBDatabase,
        store: Store,
        id: string,
        data: FormatedInfosData,
        attr: 'infos' | 'data',
    ): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            console.log(`Get data in “${store}” for [${id}].`);
            const transactionData = db.transaction([store], 'readwrite');
            const item = transactionData.objectStore(store).get(id);

            item.onsuccess = function (this: IDBRequest<T>) {
                console.log('getInfosList', this.result);
                (data as any)[attr] = this.result;
                resolve(db);
            };
            item.onerror = () => {
                console.error('getByIdDB: An error has occurred!', item?.error?.message);
                reject();
            };
        });
    }

    private _deleteDB(db: IDBDatabase, store: Store, id: string): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            console.log(`Remove data in “${store}”.`);
            const transactionData = db.transaction([store], 'readwrite');

            transactionData.onerror = () => {
                console.error(`An error in “${store}” has occurred!`, transactionData?.error?.message);
                reject();
            };
            transactionData.oncomplete = () => {
                console.log(`Data removed successfully in “${store}”.`);
                resolve(db);
            };

            transactionData.objectStore(store).delete(id);
        });
    }

    private _saveDB<T extends IndexedData>(db: IDBDatabase, store: Store, data: T): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            console.log(`Add Data in “${store}”.`);
            const transactionData = db.transaction([store], 'readwrite');

            transactionData.onerror = () => {
                console.error(`An error in “${store}” has occurred!`, transactionData?.error?.message);
                reject();
            };
            transactionData.oncomplete = () => {
                console.log(`Data added successfully in “${store}”.`);
                resolve(db);
            };

            transactionData.objectStore(store).add(data, data.id);
        });
    }

    private _getDB(): Promise<IDBDatabase> {
        return new Promise<IDBDatabase>((resolve, reject) => {
            if (this._db) {
                resolve(this._db);
            } else {
                const dbReq = indexedDB.open('classementDB', 1);

                dbReq.onerror = () => {
                    console.error('Error for init Database.', dbReq.error);
                    reject();
                };

                dbReq.onupgradeneeded = () => {
                    console.log('Upgrade DB');
                    dbReq.result.createObjectStore(Store.infos).createIndex('infos', 'infos', {
                        unique: true,
                    });
                    dbReq.result.createObjectStore(Store.data).createIndex('data', 'data', {
                        unique: true,
                    });
                };

                dbReq.onsuccess = () => {
                    console.log('DB init successfully.');
                    this._db = dbReq.result;
                    resolve(this._db);
                };
            }
        });
    }
}
