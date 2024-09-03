import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, inject, output, viewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { TranslocoService } from '@jsverse/transloco';

import {
    themes,
    themesAxis,
    themesBingo,
    themesIceberg,
    themesLists,
} from 'src/app/content/classement/classement-default';
import { ModeNames } from 'src/app/interface/interface';
import { GlobalService } from 'src/app/services/global.service';
import { Logger } from 'src/app/services/logger';
import { PreferencesService } from 'src/app/services/preferences.service';
import { emojis } from 'src/app/tools/emoji';

import { environment } from 'src/environments/environment';
import { DialogComponent } from '../dialog/dialog.component';
import { TabsComponent } from '../tabs/tabs.component';

const languages = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'ja', label: '日本語' },
];

@Component({
    selector: 'preferences-dialog',
    templateUrl: './preferences.component.html',
    styleUrls: ['./preferences.component.scss'],
})
export class PreferencesDialogComponent {
    //inject

    private readonly preferencesService = inject(PreferencesService);
    private readonly logger = inject(Logger);
    private readonly translate = inject(TranslocoService);
    private readonly globalService = inject(GlobalService);

    // viewChild

    readonly preferences = viewChild.required<DialogComponent>('preferences');
    readonly preferencesTabs = viewChild('preferencesTabs', { read: TabsComponent });

    // output

    mainMenuReduce = output<boolean>();

    languages = languages;

    themes? = themes;

    emojiList = emojis;
    emojiSort: string[] = [];

    modeApi = environment.api?.active || false;

    preferencesForm?: FormGroup;

    constructor() {
        // preferences
        this.initPreferences().then(() => {
            this.updateLanguage(this.preferencesForm!.get('interfaceLanguage')!.value);
        });
        this.preferencesService.openPref.subscribe(panelName => {
            this.preferences().open();
            this.preferencesTabs()?.update(panelName);
        });
    }

    open() {
        this.preferences().open();
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.emojiSort, event.previousIndex, event.currentIndex);
        this.savePref();
    }

    updateLanguage(lang: string) {
        this.logger.log('Update language: ' + lang);
        this.translate.load(lang).subscribe(() => {
            this.translate.setActiveLang(lang);
        });
        document.documentElement.setAttribute('lang', lang);
        this.globalService.lang = lang;
    }

    private initThemeByMode(mode: ModeNames | 'choice', updateThemeValue = true) {
        switch (mode) {
            case 'choice':
                this.themes = undefined;
                break;
            case 'iceberg':
                this.themes = themesIceberg;
                break;
            case 'axis':
                this.themes = themesAxis;
                break;
            case 'bingo':
                this.themes = themesBingo;
                break;
            default:
                this.themes = themesLists;
                break;
        }

        if (updateThemeValue) {
            this.preferencesForm!.get('theme')?.setValue(this.themes?.[0]);
        }
    }

    removeEmoji(emoji: string) {
        this.emojiSort.splice(this.emojiSort.indexOf(emoji), 1);
        this.savePref();
    }

    addEmoji(emoji: string) {
        if (this.emojiSort.length < 12) {
            this.emojiSort.push(emoji);
            this.savePref();
        }
    }

    private async initPreferences() {
        const initPreferences = await this.preferencesService.init();

        // theme
        this.globalService.userSchema = initPreferences.interfaceTheme;
        this.globalService.changeThemeClass();

        // autodetect language
        const l = languages.filter(i => navigator.language.startsWith(i.value));
        const selectedLang = l.length ? l[0].value : 'en';

        // menu
        this.mainMenuReduce.emit(initPreferences.mainMenuReduce);

        this.emojiSort = initPreferences.emojiList;

        this.preferencesForm = new FormGroup({
            interfaceLanguage: new FormControl(initPreferences.interfaceLanguage ?? selectedLang),
            interfaceTheme: new FormControl(this.globalService.userSchema),
            nameCopy: new FormControl(initPreferences.nameCopy),
            newColor: new FormControl(initPreferences.newColor),
            newLine: new FormControl(initPreferences.newLine),
            lineOption: new FormControl(initPreferences.lineOption),
            mode: new FormControl(initPreferences.mode),
            theme: new FormControl(initPreferences.theme),
            pageSize: new FormControl(initPreferences.pageSize),
            mainMenuReduce: new FormControl(initPreferences.mainMenuReduce),
            zoomMobile: new FormControl(initPreferences.zoomMobile),
            authApiKeys: new FormGroup({
                imdb: new FormControl(initPreferences.authApiKeys.imdb ?? ''),
            }),
        });

        this.preferencesForm.valueChanges.subscribe(() => {
            this.savePref();
        });

        this.preferencesForm.get('mode')?.valueChanges.subscribe((mode: ModeNames | 'choice') => {
            this.initThemeByMode(mode);
        });
        this.initThemeByMode(initPreferences.mode, false);

        this.preferencesForm.get('pageSize')?.valueChanges.subscribe((value: number) => {
            try {
                this.preferencesForm!.get('pageSize')?.setValue(Math.min(50, Math.max(9, value)), { emitEvent: false });
            } catch (e) {
                this.preferencesForm!.get('pageSize')?.setValue(24, { emitEvent: false });
            }
        });

        this.preferencesForm.get('interfaceLanguage')?.valueChanges.subscribe((value: string) => {
            this.updateLanguage(value);
        });
    }

    private savePref() {
        const data = this.preferencesForm!.value;
        data.emojiList = this.emojiSort;
        this.preferencesService.saveAndUpdate(data);
    }
}
