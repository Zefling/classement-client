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
    selectedLang!: string;

    constructor(private _translate: TranslateService) {
        // autodetect language
        const l = languages.filter(i => navigator.language.startsWith(i.value));
        this.selectedLang = l.length ? l[0].value : 'en';
        this.updateLanguage(this.selectedLang);
    }

    updateLanguage(event: string) {
        console.log('Update language: ' + event);
        this._translate.use(event);
    }
}
