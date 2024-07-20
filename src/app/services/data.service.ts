import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DataService<T> {
    data: Record<string, { group: number; item: number; value: T }[]> = {};

    init(id: string) {
        if (!this.data[id]) {
            this.clear(id);
        }
    }

    change(id: string, group: number, item: number, value: T) {
        this.init(id);

        const record = this.data[id].find(e => e.group === group && e.item === item);
        if (record) {
            record.value = value;
        } else {
            this.data[id].push({ group, item, value });
        }
    }

    value(id: string, group: number, item: number): T | undefined {
        return this.data[id].find(e => e.group === group && e.item === item)?.value;
    }

    clear(id: string) {
        this.data[id] = [];
    }
}
