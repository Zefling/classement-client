import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    inject,
    output,
    signal,
    viewChild,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
    LightDark,
    Logger,
    MagmaClickOutsideDirective,
    MagmaDialog,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputRadio,
    MagmaInputSelect,
    MagmaInputText,
    MagmaLightDark,
    MagmaTabs,
    MagmaTabsModule,
    PreferenceInterfaceTheme,
} from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { Select2Data, Select2Option } from 'ng-select2-component';

import {
    themes,
    themesAxis,
    themesBingo,
    themesIceberg,
    themesLists,
} from 'src/app/content/classement/classement-default';
import { ModeNames } from 'src/app/interface/interface';
import { GlobalService } from 'src/app/services/global.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { emojis } from 'src/app/tools/emoji';

const languages: Select2Option[] = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'ja', label: '日本語' },
];

@Component({
    selector: 'preferences-dialog',
    templateUrl: './preferences.component.html',
    styleUrls: ['./preferences.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CdkDropList,
        CdkDrag,
        TranslocoPipe,
        MagmaClickOutsideDirective,
        MagmaDialog,
        MagmaTabsModule,
        MagmaLightDark,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaInputSelect,
        MagmaInputNumber,
        MagmaInputCheckbox,
        MagmaInputRadio,
    ],
})
export class PreferencesMagmaDialog {
    //inject

    private readonly preferencesService = inject(PreferencesService);
    private readonly logger = inject(Logger);
    private readonly translate = inject(TranslocoService);
    private readonly lightDark = inject(LightDark);
    private readonly globalService = inject(GlobalService);
    private readonly cd = inject(ChangeDetectorRef);

    // viewChild

    readonly preferences = viewChild.required<MagmaDialog>('preferences');
    readonly preferencesTabs = viewChild('preferencesTabs', { read: MagmaTabs });

    // output

    readonly mainMenuReduce = output<boolean>();

    // template

    languages = languages;

    themes = signal<string[] | undefined>(themes);
    themesList = computed(() => this.themes()?.map<Select2Option>(theme => ({ value: theme, label: theme })));

    emojiList = emojis;
    emojiSort: string[] = [];

    modeApi = computed(() => this.globalService.withApi());

    preferencesForm?: FormGroup;

    modes: Select2Data = [
        { value: 'choice', label: 'choice' },
        { value: 'default', label: 'default' },
        { value: 'teams', label: 'teams' },
        { value: 'columns', label: 'columns' },
        { value: 'iceberg', label: 'iceberg' },
        { value: 'axis', label: 'axis' },
        { value: 'bingo', label: 'bingo' },
    ];

    resizeMode: Select2Data = [
        { value: 'origin', label: 'no.resize' },
        { value: '300×300', label: '300' },
        { value: '500×500', label: '500' },
    ];

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
        this.cd.detectChanges();
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
                this.themes.set(undefined);
                break;
            case 'iceberg':
                this.themes.set(themesIceberg);
                break;
            case 'axis':
                this.themes.set(themesAxis);
                break;
            case 'bingo':
                this.themes.set(themesBingo);
                break;
            default:
                this.themes.set(themesLists);
                break;
        }

        this.cd.detectChanges();

        if (updateThemeValue) {
            this.preferencesForm!.get('theme')?.setValue(this.themes()?.[0]);
        }
    }

    emojiAction(emoji: string, hide?: { test: boolean }) {
        if (!this.emojiSort.includes(emoji)) {
            this.addEmoji(emoji);
            if (hide) {
                hide.test != hide.test;
            }
        }
    }

    toggleEmoji(event: Event, hide: { test: boolean }) {
        hide.test = !hide.test;
        event.stopPropagation();
        window.dispatchEvent(new CustomEvent('dialog-click', { detail: event }));
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

    changeLightDark(value: PreferenceInterfaceTheme) {
        this.preferencesForm!.get('interfaceTheme')?.setValue(value);
    }

    private async initPreferences() {
        const initPreferences = await this.preferencesService.init();

        // theme
        this.lightDark.init(initPreferences.interfaceTheme);

        // autodetect language
        const l = languages.filter(i => navigator.language.startsWith(i.value as string));
        const selectedLang = l.length ? l[0].value : 'en';

        // menu
        this.mainMenuReduce.emit(initPreferences.mainMenuReduce);

        this.emojiSort = initPreferences.emojiList;

        this.preferencesForm = new FormGroup({
            interfaceLanguage: new FormControl(initPreferences.interfaceLanguage ?? selectedLang),
            interfaceTheme: new FormControl(this.lightDark.currentTheme()),
            nameCopy: new FormControl(initPreferences.nameCopy),
            newColor: new FormControl(initPreferences.newColor),
            newLine: new FormControl(initPreferences.newLine),
            lineOption: new FormControl(initPreferences.lineOption),
            mode: new FormControl(initPreferences.mode),
            autoResize: new FormControl(initPreferences.autoResize),
            theme: new FormControl(initPreferences.theme),
            pageSize: new FormControl(initPreferences.pageSize),
            mainMenuReduce: new FormControl(initPreferences.mainMenuReduce),
            zoomMobile: new FormControl(initPreferences.zoomMobile),
            adult: new FormControl(initPreferences.adult),
            advancedOptions: new FormControl(initPreferences.advancedOptions),
            advancedFork: new FormControl(initPreferences.advancedFork),
            authApiKeys: new FormGroup({
                imdb: new FormControl(initPreferences.authApiKeys.imdb ?? ''),
            }),
            api: new FormGroup({
                anilist: new FormControl(initPreferences.api.anilist ?? true),
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
            this.preferencesForm!.get('pageSize')?.setValue(Math.min(50, Math.max(9, value || 24)), {
                emitEvent: false,
            });
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
