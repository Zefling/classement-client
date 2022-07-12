import { Injectable } from '@angular/core';

import { Data, FormatedInfos, FormatedInfosData, IndexedData } from '../interface';
import { Utils } from '../tools/utils';


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

    clone(item: FormatedInfos, title: string): Promise<FormatedInfos> {
        return new Promise((resolve, reject) => {
            const formatData: any = {};
            const cloneItem = Utils.jsonCopy(item);
            cloneItem.date = `${new Date()}`;
            cloneItem.options.title = title;
            this._digestMessage(cloneItem.date).then(id => {
                cloneItem.id = id;
                this._getDB()
                    .then(db => this._saveDB(db, Store.infos, cloneItem))
                    .then(db => this._getByIdDB(db, Store.data, item.id as string, formatData, 'data'))
                    .then(db => {
                        (formatData as FormatedInfosData).data.id = cloneItem.id;
                        return this._saveDB(db, Store.data, formatData.data);
                    })
                    .then(__ => resolve(cloneItem))
                    .catch(_ => reject());
            });
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

    saveLocal(data: Data): Promise<FormatedInfosData> {
        return new Promise((resolve, reject) => {
            this._formatData(data).then(formatData => {
                this._getDB()
                    .then(db =>
                        data.id
                            ? this._updateDB(db, Store.infos, formatData.infos)
                            : this._saveDB(db, Store.infos, formatData.infos),
                    )
                    .then(db =>
                        data.id
                            ? this._updateDB(db, Store.data, formatData.data)
                            : this._saveDB(db, Store.data, formatData.data),
                    )
                    .then(__ => resolve(formatData))
                    .catch(_ => reject());
            });
        });
    }

    private async _formatData(data: Data): Promise<FormatedInfosData> {
        const id = data.id || (await this._digestMessage(`${new Date()}`));
        return {
            infos: {
                id,
                options: data.options,
                date: `${new Date()}`,
                groupsLenght: data.groups?.length || 0,
                listLenght:
                    (data.list?.length || 0) +
                    (data.groups?.reduce<number>((prev, curr) => prev + (curr.list?.length || 0), 0) || 0),
                // server link
                rankingId: data.rankingId,
                templateId: data.templateId,
            },
            data: {
                id,
                groups: data.groups,
                list: data.list,
            },
        };
    }

    private async _digestMessage(message?: string): Promise<string> {
        const hashBuffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(message));
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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

            const save = transactionData.objectStore(store).add(data, data.id);
            save.onsuccess = function () {
                console.log(`Data added successfully in “${store}”.`);
                resolve(db);
            };
            save.onerror = () => {
                console.error(`An error in “${store}” has occurred!`, transactionData);
                reject();
            };
        });
    }

    private _updateDB<T extends IndexedData>(db: IDBDatabase, store: Store, data: T): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            console.log(`Add Data in “${store}”.`);
            const transactionData = db.transaction([store], 'readwrite');

            transactionData.objectStore(store).openCursor(data.id).onsuccess = function () {
                const cursor = this.result;
                if (cursor) {
                    const request = cursor.update(data);
                    request.onsuccess = function () {
                        console.log(`Data updated successfully in “${store}”.`);
                        resolve(db);
                    };
                    request.onerror = function () {
                        console.error(`An error in “${store}” has occurred!`, request);
                        reject();
                    };
                }
            };
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
