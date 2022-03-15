import { Component, HostBinding, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { DialogComponent } from './components/dialog.component';
import { GlobalService } from './services/global.service';


const languages = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
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

    private _route?: string;

    constructor(private _translate: TranslateService, private _globalService: GlobalService, private _router: Router) {
        // autodetect language
        const l = languages.filter(i => navigator.language.startsWith(i.value));
        this.selectedLang = l.length ? l[0].value : 'en';
        this.updateLanguage(this.selectedLang);

        this._globalService.onForceExit.subscribe((route?: string) => {
            this.warningExit.open();
            this._route = route;
        });
    }

    toggleMenu() {
        this.asideOpen = !this.asideOpen;
    }

    updateLanguage(event: string) {
        console.log('Update language: ' + event);
        this._translate.use(event);
    }

    exit(ok: boolean) {
        if (ok) {
            this._globalService.withChange = false;
            this._router.navigate([this._route]);
        }
        this.warningExit.close();
    }
}
