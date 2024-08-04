import { Injectable } from '@angular/core';
import { DBService } from './db.service';

export type DataExtra<T> = Record<string, { group: number; item: number; value: T }[]>;

@Injectable({ providedIn: 'root' })
export class DataService<T> {
    data: Record<string, DataExtra<T>> = {};

    constructor(private readonly db: DBService) {}

    async init(type: string, id: string) {
        if (!this.data[type]) {
            this.data[type] = (await this.db.loadExtraData<T>(type)) ?? {};
        }
        this.data[type] ??= {};

        if (!this.data[type][id]) {
            this.clear(type, id);
        }
    }

    change(type: string, id: string, group: number, item: number, value: T) {
        this.init(type, id);

        const record = this.data[type]?.[id]?.find(e => e.group === group && e.item === item);
        if (record) {
            record.value = value;
        } else {
            this.data[type] ??= {};
            this.data[type][id] ??= [];
            this.data[type][id].push({ group, item, value });
        }

        this.db.saveExtraData<T>(type, this.data[type]);
    }

    value(type: string, id: string, group: number, item: number): T | undefined {
        return this.data[type]?.[id]?.find(e => e.group === group && e.item === item)?.value;
    }

    clear(type: string, id: string) {
        this.data[type][id] = [];
        this.db.saveExtraData<T>(type, this.data[type]);
    }
}
