import { Component, HostBinding, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { environment } from 'src/environments/environment';

import { DialogComponent } from './components/dialog.component';
import { GlobalService } from './services/global.service';
import { UserService } from './services/user.service';


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
export class AppComponent {
    @ViewChild('warningExit') warningExit!: DialogComponent;

    languages = languages;
    selectedLang!: string;

    @HostBinding('class.show-menu')
    asideOpen = false;

    modeApi = environment.api?.active ?? false;

    private _route?: string;

    constructor(
        private _translate: TranslateService,
        private _globalService: GlobalService,
        private _router: Router,
        public userService: UserService,
    ) {
        // autodetect language
        const l = languages.filter(i => navigator.language.startsWith(i.value));
        this._globalService.lang = this.selectedLang = l.length ? l[0].value : 'en';
        this.updateLanguage(this.selectedLang);

        this._globalService.onForceExit.subscribe((route?: string) => {
            this.warningExit.open();
            this._route = route;
        });

        if (environment.api?.active) {
            userService.initProfile(true).then(() => {
                console.log('Auto logged !!');
            });
        }
    }

    toggleMenu() {
        this.asideOpen = !this.asideOpen;
    }

    updateLanguage(lang: string) {
        console.log('Update language: ' + lang);
        this._translate.use(lang);
        this._globalService.lang = lang;
    }

    exit(ok: boolean) {
        if (ok) {
            this._globalService.withChange = false;
            this._router.navigate([this._route]);
        }
        this.warningExit.close();
    }
}
