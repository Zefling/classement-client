import { Injectable, inject } from '@angular/core';

import { Subject } from 'rxjs';

import { DataExtra } from './data.service';
import { Logger, LoggerLevel } from './logger';

import { Data, FormattedInfos, FormattedInfosData, IndexedData, PreferencesData, Theme } from '../interface/interface';
import { Utils } from '../tools/utils';

enum Store {
    infos = 'classementInfos',
    data = 'classementData',
    pref = 'preferences',
    extra = 'extraData',
    themes = 'classementThemes',
}

type DBAttr = 'infos' | 'data' | 'pref' | 'extra';

@Injectable({ providedIn: 'root' })
export class DBService {
    private readonly logger = inject(Logger);

    private _db!: IDBDatabase;

    accessState = true;
    private accessSubject = new Subject<void>();

    access(): Promise<void> {
        return new Promise(resolve => {
            if (this.accessState) {
                resolve();
            } else {
                const sub = this.accessSubject.subscribe(() => {
                    this.accessState = true;
                    sub.unsubscribe();
                    resolve();
                });
            }
        });
    }

    async getLocalList(): Promise<FormattedInfos[]> {
        return this._getInfosList(await this._getDB());
    }

    async getLocalData(): Promise<FormattedInfosData[]> {
        const infos = await this.getLocalList();
        const list: FormattedInfosData[] = [];
        for (const info of infos) {
            list.push(await this.loadLocal(info.id!));
        }
        return list;
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

    clone(item: FormattedInfos, title: string, newTemplate: boolean = false): Promise<FormattedInfos> {
        return new Promise(async (resolve, reject) => {
            const formatData: any = {};
            const cloneItem = Utils.jsonCopy(item);
            cloneItem.dateCreate = Utils.toISODate();
            cloneItem.options.title = title;
            cloneItem.rankingId = undefined;
            if (newTemplate) {
                cloneItem.templateId = undefined;
            }
            cloneItem.id = await this._digestMessage(cloneItem.dateCreate);
            this._getDB()
                .then(db => this._saveDB(db, Store.infos, cloneItem))
                .then(db => this._getByIdDB(db, Store.data, item.id as string, formatData, 'data'))
                .then(db => {
                    (formatData as FormattedInfosData).data.id = cloneItem.id;
                    return this._saveDB(db, Store.data, formatData.data);
                })
                .then(__ => resolve(cloneItem))
                .catch(_ => reject());
        });
    }

    loadLocal(id: string): Promise<FormattedInfosData> {
        const formatData: any = {};
        return new Promise((resolve, reject) => {
            this._getDB()
                .then(db => this._getByIdDB(db, Store.infos, id, formatData, 'infos'))
                .then(db => this._getByIdDB(db, Store.data, id, formatData, 'data'))
                .then(__ => resolve(formatData))
                .catch(_ => reject());
        });
    }

    saveLocal(data: Data): Promise<FormattedInfosData> {
        this.accessState = false;
        return new Promise((resolve, reject) => {
            this._formatData(data).then(formatData => {
                this._getDB()
                    .then(db =>
                        formatData.update
                            ? this._updateDB(db, Store.infos, formatData.infos)
                            : this._saveDB(db, Store.infos, formatData.infos),
                    )
                    .then(db =>
                        formatData.update
                            ? this._updateDB(db, Store.data, formatData.data)
                            : this._saveDB(db, Store.data, formatData.data),
                    )
                    .then(__ => resolve(formatData))
                    .catch(_ => reject())
                    .finally(() => {
                        this.accessSubject.next();
                    });
            });
        });
    }

    loadPreferences(): Promise<PreferencesData> {
        const formatData: any = {};
        return new Promise((resolve, reject) => {
            this._getDB()
                .then(db => this._getByIdDB(db, Store.pref, 'pref', formatData, 'pref'))
                .then(__ => resolve(formatData.pref.data))
                .catch(_ => reject());
        });
    }

    saveLocalTheme(theme: Theme<string>): Promise<Theme<string>> {
        return new Promise(async (resolve, reject) => {
            let update = true;
            if (!theme.id) {
                theme.id = await this._digestMessage(Utils.toISODate());
                update = false;
            }
            this._getDB()
                .then(db => (update ? this._updateDB(db, Store.themes, theme) : this._saveDB(db, Store.themes, theme)))
                .then(__ => resolve(theme))
                .catch(_ => reject())
                .finally(() => {
                    this.accessSubject.next();
                });
        });
    }

    getLocalTheme(id: string) {
        const theme: any = {};
        return new Promise((resolve, reject) => {
            this._getDB()
                .then(db => this._getByIdDB(db, Store.themes, id, theme, 'data'))
                .then(__ => resolve(theme))
                .catch(_ => reject());
        });
    }

    async getLocalAllThemes() {
        return this._getInfosList<Theme>(await this._getDB(), Store.themes);
    }

    savePreferences(preferences: PreferencesData): Promise<PreferencesData> {
        const formatData: IndexedData<PreferencesData> = {
            id: 'pref',
            data: preferences,
        };
        return new Promise((resolve, reject) => {
            this._getDB()
                .then(async db =>
                    (await this._testByIdDB(db, Store.pref, 'pref'))
                        ? this._updateDB(db, Store.pref, formatData)
                        : this._saveDB(db, Store.pref, formatData),
                )
                .then(__ => resolve(formatData.data!))
                .catch(_ => reject());
        });
    }

    loadExtraData<T, U>(id: string): Promise<DataExtra<T, U>> {
        const formatData: any = {};
        return new Promise((resolve, reject) => {
            this._getDB()
                .then(db => this._getByIdDB(db, Store.extra, id, formatData, 'extra'))
                .then(__ => resolve(formatData.extra.data))
                .catch(_ => reject());
        });
    }

    saveExtraData<T, U>(id: string, data: DataExtra<T, U>) {
        const formatData: IndexedData<DataExtra<T, U>> = {
            id,
            data,
        };
        return new Promise((resolve, reject) => {
            this._getDB()
                .then(async db =>
                    (await this._testByIdDB(db, Store.extra, id))
                        ? this._updateDB(db, Store.extra, formatData)
                        : this._saveDB(db, Store.extra, formatData),
                )
                .then(__ => resolve(formatData))
                .catch(_ => reject());
        });
    }

    private async _formatData(data: Data): Promise<FormattedInfosData> {
        let exist = false;
        if (data.id) {
            const db = await this._getDB();
            exist =
                (await this._testByIdDB(db, Store.infos, data.id)) && (await this._testByIdDB(db, Store.data, data.id));

            // case with saved on server, but not in local
            if (data.templateId && !data.rankingId) {
                data.rankingId = data.id;
                data.id = undefined;
            }
        }
        const id = !data.id ? await this._digestMessage(`${Date.now()}`) : data.id;
        this.logger.log('Existing data', LoggerLevel.log, exist);
        return {
            update: exist,
            infos: {
                id,
                options: data.options,
                dateCreate: Utils.toISODate(data.dateCreate, true),
                dateChange: Utils.toISODate(data.dateChange),
                groupsLength: data.groups?.length || 0,
                listLength:
                    (data.list?.length || 0) +
                    (data.groups?.reduce<number>((prev, curr) => prev + (curr.list?.length || 0), 0) || 0),
                // server data
                rankingId: data.rankingId,
                templateId: data.templateId,
                parentId: data.parentId,
                linkId: data.linkId,
                banner: data.banner,
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

    private _getInfosList<T>(db: IDBDatabase, store = Store.infos): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.logger.log('Read Infos');
            const _this = this;
            const list = db.transaction([store], 'readwrite').objectStore(store).getAll();
            list.onsuccess = function (this: IDBRequest<T[]>) {
                _this.logger.log('getInfosList', LoggerLevel.log, store, this.result);
                resolve(this.result);
            };
            list.onerror = () => {
                this.logger.log('getInfosList: An error has occurred!', LoggerLevel.error, list?.error?.message);
                reject();
            };
        });
    }

    private _getByIdDB<T>(
        db: IDBDatabase,
        store: Store,
        id: string,
        data: FormattedInfosData,
        attr: DBAttr,
    ): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            this.logger.log(`Get data in “${store}” for [${id}].`);
            const transactionData = db.transaction([store], 'readwrite');
            const item = transactionData.objectStore(store).get(id);
            const _this = this;

            item.onsuccess = function (this: IDBRequest<T>) {
                _this.logger.log('getInfosList', LoggerLevel.log, this.result);
                (data as any)[attr] = this.result;
                resolve(db);
            };
            item.onerror = () => {
                this.logger.log('getByIdDB: An error has occurred!', LoggerLevel.error, item?.error?.message);
                reject();
            };
        });
    }

    private _testByIdDB(db: IDBDatabase, store: Store, id: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.logger.log(`Test data in “${store}” for [${id}].`);
            const transactionData = db.transaction([store], 'readwrite');
            const item = transactionData.objectStore(store).get(id);
            const _this = this;

            item.onsuccess = function () {
                _this.logger.log(`Test data found in “${store}” for [${id}].`);
                resolve(!!this.result);
            };
            item.onerror = () => {
                this.logger.log(`Test data not found in “${store}” for [${id}].`);
                resolve(false);
            };
        });
    }

    private _deleteDB(db: IDBDatabase, store: Store, id: string): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            this.logger.log(`Remove data in “${store}”.`);
            const transactionData = db.transaction([store], 'readwrite');

            transactionData.onerror = () => {
                this.logger.log(
                    `An error in “${store}” has occurred!`,
                    LoggerLevel.error,
                    transactionData?.error?.message,
                );
                reject();
            };
            transactionData.oncomplete = () => {
                this.logger.log(`Data removed successfully in “${store}”.`);
                resolve(db);
            };

            transactionData.objectStore(store).delete(id);
        });
    }

    private _saveDB<T extends IndexedData<any>>(db: IDBDatabase, store: Store, data: T): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            this.logger.log(`Add data in “${store}”.`);
            const transactionData = db.transaction([store], 'readwrite');
            try {
                const save = transactionData.objectStore(store).add(data, data.id);
                const _this = this;
                save.onsuccess = function () {
                    _this.logger.log(`Data added successfully in “${store}”.`);
                    resolve(db);
                };
                save.onerror = () => {
                    this.logger.log(`An error in “${store}” has occurred!`, LoggerLevel.error, transactionData);
                    reject();
                };
            } catch (e) {
                this.logger.log(`An error in “${store}” has occurred!`, LoggerLevel.error, e);
                reject();
            }
        });
    }

    private _updateDB<T extends IndexedData<any>>(db: IDBDatabase, store: Store, data: T): Promise<IDBDatabase> {
        const that = this;
        return new Promise((resolve, reject) => {
            this.logger.log(`Update data in “${store}”.`);
            const transactionData = db.transaction([store], 'readwrite');
            const _this = this;

            transactionData.objectStore(store).openCursor(data.id).onsuccess = function () {
                const cursor = this.result;
                if (cursor) {
                    const request = cursor.update(data);
                    request.onsuccess = function () {
                        _this.logger.log(`Data updated successfully in “${store}”.`);
                        resolve(db);
                    };
                    request.onerror = function () {
                        _this.logger.log(`An error in “${store}” has occurred!`, LoggerLevel.error, request);
                        reject();
                    };
                } else {
                    // if data not existe with this id
                    _this.logger.log(`No data found in “${store}”. ${data.id}`);
                }
            };
        });
    }

    private _getDB(): Promise<IDBDatabase> {
        return new Promise<IDBDatabase>((resolve, reject) => {
            if (this._db) {
                resolve(this._db);
            } else {
                const dbReq = indexedDB.open('classementDB', 8);

                dbReq.onerror = () => {
                    this.logger.log('Error for init Database.', LoggerLevel.error, dbReq.error);
                    reject();
                };

                dbReq.onupgradeneeded = () => {
                    this.logger.log('Upgrade DB');
                    const names = dbReq.result.objectStoreNames;
                    if (!names.contains(Store.infos)) {
                        dbReq.result.createObjectStore(Store.infos).createIndex('infos', 'infos', {
                            unique: true,
                        });
                    }
                    if (!names.contains(Store.data)) {
                        dbReq.result.createObjectStore(Store.data).createIndex('data', 'data', {
                            unique: true,
                        });
                    }
                    if (!names.contains(Store.pref)) {
                        dbReq.result.createObjectStore(Store.pref).createIndex('pref', 'pref', {
                            unique: true,
                        });
                    }
                    if (!names.contains(Store.extra)) {
                        dbReq.result.createObjectStore(Store.extra).createIndex('extra', 'extra', {
                            unique: true,
                        });
                    }
                    if (!names.contains(Store.themes)) {
                        dbReq.result.createObjectStore(Store.themes).createIndex('themes', 'themes', {
                            unique: true,
                        });
                    }
                };

                dbReq.onsuccess = () => {
                    this.logger.log('DB init successfully.');
                    this._db = dbReq.result;
                    resolve(this._db);
                };
            }
        });
    }
}
