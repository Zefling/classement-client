import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { DBService } from './db.service';

import { themes } from '../content/classement/classement-default';
import { PreferencesData } from '../interface/interface';

/**
 * For persistence during the session of use
 */
@Injectable({ providedIn: 'root' })
export class PreferencesService {
    readonly onInit = new Subject<void>();
    readonly onChange = new Subject<PreferencesData>();
    readonly openPref = new Subject<string>();

    hasInit = false;

    private initPreferences: PreferencesData = {
        nameCopy: false,
        newColor: 'mixed',
        newLine: 'below',
        mode: 'choice',
        theme: themes[0],
        lineOption: 'auto',
        pageSize: 24,
        mainMenuReduce: false,
        emojiList: ['🥰', '🤩', '🤩', '🤪', '😁', '😏'],
        authApiKeys: {
            imdb: '',
        },
    };

    get preferences(): PreferencesData {
        return this.initPreferences;
    }

    constructor(private readonly dbService: DBService) {}

    init(): Promise<PreferencesData> {
        return new Promise<PreferencesData>(resolve => {
            this.dbService
                .loadPreferences()
                .then(preferences => {
                    if (preferences) {
                        Object.assign(this.initPreferences, preferences);
                    }
                })
                .catch(() => {
                    // nothing
                })
                .finally(() => {
                    this.hasInit = true;
                    this.onInit.next();
                    resolve(this.initPreferences);
                });
        });
    }

    saveAndUpdate(data: PreferencesData) {
        this.dbService.savePreferences(data);
        this.initPreferences = data;
        this.onChange.next(data);
    }

    openPanel(tabs: string) {
        this.openPref.next(tabs);
    }
}
