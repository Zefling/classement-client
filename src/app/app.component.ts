import { ChangeDetectorRef, Component, DoCheck, ElementRef, HostBinding, ViewChild } from '@angular/core';
import { Event, Router, Scroll } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { filter } from 'rxjs';

import { environment } from 'src/environments/environment';

import { DialogComponent } from './components/dialog/dialog.component';
import { APIUserService } from './services/api.user.service';
import { GlobalService } from './services/global.service';
import { Logger, LoggerLevel } from './services/logger';


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
    @ViewChild('main') main!: ElementRef<HTMLDivElement>;

    languages = languages;
    selectedLang!: string;

    loading = environment.api?.active;

    @HostBinding('class.show-menu')
    asideOpen = false;

    modeApi = environment.api?.active || false;
    modeModerator = false;

    private route?: string;

    constructor(
        private translate: TranslateService,
        private globalService: GlobalService,
        private router: Router,
        private logger: Logger,
        public userService: APIUserService,
        changeDetectorRef: ChangeDetectorRef,
    ) {
        // autodetect language
        const l = languages.filter(i => navigator.language.startsWith(i.value));
        this.globalService.lang = this.selectedLang = l.length ? l[0].value : 'en';
        this.updateLanguage(this.selectedLang);

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

    exit(ok: boolean) {
        if (ok) {
            this.globalService.withChange = false;
            this.router.navigate([this.route]);
        }
        this.warningExit.close();
    }
}
