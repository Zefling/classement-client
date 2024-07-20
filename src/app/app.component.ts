import { ChangeDetectorRef, Component, DoCheck, ElementRef, HostBinding, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Event, Router, Scroll } from '@angular/router';

import { TranslocoService } from '@jsverse/transloco';

import { filter } from 'rxjs';

import { environment } from 'src/environments/environment';

import { DialogComponent } from './components/dialog/dialog.component';
import { themes, themesAxis, themesBingo, themesIceberg, themesLists } from './content/classement/classement-default';
import { ModeNames } from './interface/interface';
import { APIUserService } from './services/api.user.service';
import { GlobalService } from './services/global.service';
import { Logger, LoggerLevel } from './services/logger';
import { PreferencesService } from './services/preferences.service';

const languages = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'ja', label: '日本語' },
];

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements DoCheck {
    @ViewChild('warningExit') warningExit!: DialogComponent;
    @ViewChild('preferences') preferences!: DialogComponent;
    @ViewChild('choice') choice!: DialogComponent;
    @ViewChild('main') main!: ElementRef<HTMLDivElement>;

    languages = languages;

    loading = environment.api?.active;

    @HostBinding('class.show-menu')
    asideOpen = false;

    @HostBinding('class.reduce-menu')
    mainMenuReduce = true;

    modeApi = environment.api?.active || false;
    modeModerator = false;

    preferencesForm?: FormGroup;
    themes? = themes;

    _modeTemp?: string;

    get routerUrl() {
        return this.router.url;
    }

    get logged() {
        return this.userService.logged;
    }

    private route?: string;

    constructor(
        private readonly translate: TranslocoService,
        private readonly globalService: GlobalService,
        private readonly router: Router,
        private readonly logger: Logger,
        private readonly preferencesService: PreferencesService,
        private readonly userService: APIUserService,
        changeDetectorRef: ChangeDetectorRef,
    ) {
        // preferences
        this.initPreferences().then(() => {
            this.updateLanguage(this.preferencesForm!.get('interfaceLanguage')!.value);
        });

        this.globalService.onForceExit.subscribe((route?: string) => {
            this.warningExit.open();
            this.route = route;
        });

        this.globalService.onOpenChoice.subscribe(() => {
            this.choice.open();
        });

        router.events.pipe(filter((event: Event): event is Scroll => event instanceof Scroll)).subscribe(e => {
            changeDetectorRef.detectChanges();
            this.main.nativeElement.scroll({ top: 0, behavior: 'auto' });
        });

        if (environment.api?.active) {
            userService
                .initProfile()
                .then(() => {
                    this.logger.log('Auto login success!!');
                })
                .catch(() => {
                    this.logger.log('Auto login error!!', LoggerLevel.error);
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }

    ngDoCheck() {
        const modeModerator = this.userService?.isModerator || this.userService?.isAdmin || false;
        if (this.modeModerator !== modeModerator) {
            this.modeModerator = modeModerator;
        }
    }

    toggleMenu() {
        this.asideOpen = !this.asideOpen;
    }

    toggleResizeMenu() {
        this.mainMenuReduce = !this.mainMenuReduce;
        this.preferencesForm?.get('mainMenuReduce')?.setValue(this.mainMenuReduce);
    }

    updateLanguage(lang: string) {
        this.logger.log('Update language: ' + lang);
        this.translate.load(lang).subscribe(() => {
            this.translate.setActiveLang(lang);
        });
        document.documentElement.setAttribute('lang', lang);
        this.globalService.lang = lang;
    }

    logout() {
        if (environment.api?.active) {
            this.userService.loggedStatus().then(() => {
                this.logger.log('logout start');
                this.userService.logout().then(() => {
                    this.logger.log('logout ok');
                });
            });
        }
    }

    exit(ok: boolean, save?: boolean) {
        if (ok) {
            if (save) {
                this.globalService.classementSave();
            }
            this.globalService.withChange = false;
            this.router.navigate([this.route]);
        }
        this.warningExit.close();
    }

    openChoice(event: MouseEvent) {
        this.toggleMenu();
        if (this.preferencesForm?.get('mode')?.value === 'choice') {
            this.choice.open();

            event.stopPropagation();
            event.preventDefault();
        }
    }

    beginNew(mode: ModeNames) {
        this.router.navigate(['edit', 'new', mode]);
        this.choice.close();
    }

    openPreferences() {
        this.preferences.open();
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
        this.mainMenuReduce = initPreferences.mainMenuReduce;

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
            authApiKeys: new FormGroup({
                imdb: new FormControl(initPreferences.authApiKeys.imdb ?? ''),
            }),
        });

        this.preferencesForm.valueChanges.subscribe(() => {
            this.preferencesService.saveAndUpdate(this.preferencesForm!.value);
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
}
