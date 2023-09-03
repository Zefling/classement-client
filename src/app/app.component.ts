import { ChangeDetectorRef, Component, DoCheck, ElementRef, HostBinding, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Event, Router, Scroll } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { filter } from 'rxjs';

import { environment } from 'src/environments/environment';

import { DialogComponent } from './components/dialog/dialog.component';
import { themes } from './content/classement/classement-default';
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
    @ViewChild('main') main!: ElementRef<HTMLDivElement>;

    languages = languages;

    loading = environment.api?.active;

    @HostBinding('class.show-menu')
    asideOpen = false;

    modeApi = environment.api?.active || false;
    modeModerator = false;

    preferencesForm?: FormGroup;
    themes = themes;

    private route?: string;

    constructor(
        private readonly translate: TranslateService,
        private readonly globalService: GlobalService,
        private readonly router: Router,
        private readonly logger: Logger,
        private readonly preferencesService: PreferencesService,
        public readonly userService: APIUserService,
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

    updateLanguage(lang: string) {
        this.logger.log('Update language: ' + lang);
        this.translate.use(lang);
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

    openPreferences() {
        this.preferences.open();
    }

    private async initPreferences() {
        const initPreferences = await this.preferencesService.init();

        // theme
        this.globalService.userShema = initPreferences.interfaceTheme;
        this.globalService.changeThemeClass();

        // autodetect language
        const l = languages.filter(i => navigator.language.startsWith(i.value));
        const selectedLang = l.length ? l[0].value : 'en';

        this.preferencesForm = new FormGroup({
            interfaceLanguage: new FormControl(initPreferences.interfaceLanguage ?? selectedLang),
            interfaceTheme: new FormControl(this.globalService.userShema),
            nameCopy: new FormControl(initPreferences.nameCopy),
            newColor: new FormControl(initPreferences.newColor),
            newLine: new FormControl(initPreferences.newLine),
            lineOption: new FormControl(initPreferences.lineOption),
            theme: new FormControl(initPreferences.theme),
            pageSize: new FormControl(initPreferences.pageSize),
            authApiKeys: new FormGroup({
                imdb: new FormControl(initPreferences.authApiKeys.imdb ?? ''),
            }),
        });

        this.preferencesForm.valueChanges.subscribe(() => {
            this.preferencesService.saveAndUpdate(this.preferencesForm!.value);
        });
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
}
