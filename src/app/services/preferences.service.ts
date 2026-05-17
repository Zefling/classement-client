import { Injectable, inject } from '@angular/core';

import { jsonCopy, objectAssignNested } from '@ikilote/magma';

import { Subject } from 'rxjs';

import { themes } from './../content/classement/classement-default';
import { DBService } from './db.service';

import { PreferencesData } from '../interface/interface';

/**
 * For persistence during the session of use
 */
@Injectable({ providedIn: 'root' })
export class PreferencesService {
    private readonly dbService = inject(DBService);

    readonly onInit = new Subject<void>();
    readonly onChange = new Subject<PreferencesData>();
    readonly openPref = new Subject<string>();
    readonly fromApi = new Subject<PreferencesData | null>();

    hasInit = false;

    readonly defaultPreferences: PreferencesData = {
        nameCopy: false,
        newColor: 'mixed',
        newLine: 'below',
        mode: 'choice',
        autoResize: 'origin',
        theme: themes[0],
        lineOption: 'auto',
        pageSize: 24,
        mainMenuReduce: false,
        emojiList: ['🥰', '😍', '🤩', '🤪', '😁', '😏'],
        zoomMobile: 100,
        adult: false,
        advancedOptions: false,
        advancedFork: false,
        authApiKeys: {
            tmdb: '',
        },
        api: {
            anilist: true,
        },
    };

    private initPreferences: PreferencesData = jsonCopy(this.defaultPreferences);
    serverPreferences?: PreferencesData;

    get preferences(): PreferencesData {
        return this.serverPreferences ?? this.initPreferences;
    }

    init(): Promise<PreferencesData> {
        return new Promise<PreferencesData>(resolve => {
            if (this.hasInit) {
                resolve(this.initPreferences);
            } else {
                this.dbService
                    .loadPreferences()
                    .then(preferences => {
                        if (preferences) {
                            objectAssignNested(this.initPreferences, preferences);

                            // retro compatibility imdb → tmdb
                            const authApiKeys = this.initPreferences.authApiKeys;
                            if ((authApiKeys as any)?.imdb) {
                                if (!authApiKeys.tmdb) {
                                    authApiKeys.tmdb = (authApiKeys as any)?.imdb;
                                    delete (authApiKeys as any).imdb;
                                }
                            }
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
            }
        });
    }

    saveAndUpdate(data: PreferencesData) {
        this.dbService.savePreferences(data);
        this.initPreferences = data;
        this.onChange.next(data);
    }

    saveTemporaire(data: PreferencesData) {
        this.serverPreferences = data;
        this.onChange.next(data);
    }

    openPanel(tabs: string) {
        this.openPref.next(tabs);
    }
}
