import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';


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
    languages = languages;
    selectedLang = 'en';

    constructor(private _translate: TranslateService) {
        // autodetect language
        const l = languages.filter(i => navigator.language.startsWith(i.value));
        if (l.length) {
            this.selectedLang = l[0].value;
        }
        this._translate.reloadLang(this.selectedLang);
    }

    updateLanguage(event: string) {
        this._translate.use(event);
    }
}
