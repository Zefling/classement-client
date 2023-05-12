import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { DBService } from './db.service';

import { themes } from '../content/classement/classement-default';
import { PreferenciesData } from '../interface';

/**
 * For persistence during the session of use
 */
@Injectable({ providedIn: 'root' })
export class PreferenciesService {
    readonly onInit = new Subject<void>();

    hasInit = false;

    private initPreferencies: PreferenciesData = {
        nameCopy: false,
        newColor: 'same',
        newLine: 'below',
        theme: themes[0],
    };

    get preferencies(): PreferenciesData {
        return this.initPreferencies;
    }

    constructor(private readonly dbService: DBService) {}

    init(): Promise<PreferenciesData> {
        return new Promise<PreferenciesData>(resolve => {
            this.dbService
                .loadPreferencies()
                .then(preferencies => {
                    if (preferencies) {
                        Object.assign(this.initPreferencies, preferencies);
                    }
                })
                .catch(() => {
                    // nothing
                })
                .finally(() => {
                    this.hasInit = true;
                    this.onInit.next();
                    resolve(this.initPreferencies);
                });
        });
    }

    saveAndUpdate(data: PreferenciesData) {
        this.dbService.savePreferencies(data);
        this.initPreferencies = data;
    }
}
