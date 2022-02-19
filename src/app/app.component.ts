import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    selectedLang = 'en';

    constructor(private _translate: TranslateService) {
        this._translate.reloadLang(this.selectedLang);
    }

    updateLanguage(event: string) {
        this._translate.use(event);
    }
}
