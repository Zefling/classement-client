import { Injectable } from '@angular/core';
import { DBService } from './db.service';

export type DataExtraCell<T> = { group: number; item: number; value: T };
export type DataExtraOption<U> = { options: U };
export type DataExtra<T, U> = Record<string, (DataExtraCell<T> | DataExtraOption<U>)[]>;

@Injectable({ providedIn: 'root' })
export class DataService<T, U> {
    data: Record<string, DataExtra<T, U>> = {};

    constructor(private readonly db: DBService) {}

    async init(type: string, id: string) {
        if (!this.data[type]) {
            this.data[type] = (await this.db.loadExtraData<T, U>(type)) ?? {};
        }
        this.data[type] ??= {};

        if (!this.data[type][id]) {
            this.clear(type, id);
        }
    }

    getOptions(type: string, id: string) {
        return (this.data[type]?.[id] as DataExtraOption<U>[])?.find(e => e.options)?.options;
    }

    saveOption(type: string, id: string, options: U) {
        this.init(type, id);
        const currentOptions = (this.data[type]?.[id] as DataExtraOption<U>[])?.find(e => e.options);

        if (currentOptions) {
            currentOptions.options = options;
        } else {
            this.data[type] ??= {};
            this.data[type][id] ??= [];
            this.data[type][id].push({ options: options });
        }

        this.db.saveExtraData<T, U>(type, this.data[type]);
    }

    change(type: string, id: string, group: number, item: number, value: T) {
        this.init(type, id);

        const record = (this.data[type]?.[id] as DataExtraCell<T>[])?.find(e => e.group === group && e.item === item);
        if (record) {
            record.value = value;
        } else {
            this.data[type] ??= {};
            this.data[type][id] ??= [];
            this.data[type][id].push({ group, item, value });
        }

        this.db.saveExtraData<T, U>(type, this.data[type]);
    }

    value(type: string, id: string, group: number, item: number): T | undefined {
        return (this.data[type]?.[id] as DataExtraCell<T>[])?.find(e => e.group === group && e.item === item)?.value;
    }

    clear(type: string, id: string) {
        this.data[type][id] = [];
        this.db.saveExtraData<T, U>(type, this.data[type]);
    }
}
