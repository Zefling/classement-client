import { Component, DoCheck, HostBinding, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { environment } from 'src/environments/environment';

import { DialogComponent } from './components/dialog.component';
import { APIUserService } from './services/api.user.service';
import { GlobalService } from './services/global.service';
import { Logger } from './services/logger';


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

    languages = languages;
    selectedLang!: string;

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
    ) {
        // autodetect language
        const l = languages.filter(i => navigator.language.startsWith(i.value));
        this.globalService.lang = this.selectedLang = l.length ? l[0].value : 'en';
        this.updateLanguage(this.selectedLang);

        this.globalService.onForceExit.subscribe((route?: string) => {
            this.warningExit.open();
            this.route = route;
        });

        if (environment.api?.active) {
            userService.initProfile().then(() => {
                this.logger.log('Auto logged !!');
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
                this.logger.log('logout');
                this.userService.logout().then(() => {});
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
