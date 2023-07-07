import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'third-party-licenses',
    templateUrl: './licenses.component.html',
    styleUrls: ['./licenses.component.scss'],
})
export class LicensesComponent {
    data!: string;

    constructor(
        private readonly http: HttpClient,
        private readonly global: GlobalService,
        private readonly translate: TranslateService,
        private readonly title: Title,
    ) {
        this.title.setTitle(`${this.translate.instant('menu.licences')} - ${this.translate.instant('classement')}`);

        if (this.global.licenses) {
            this.data = this.global.licenses;
        } else {
            this.http.get('./3rdpartylicenses.txt', { responseType: 'text' }).subscribe(data => {
                this.data = this.global.licenses = data.replace(
                    /([^\n]*)\n(MIT|Apache-2.0|0BSD|BSD-3-Clause)\n/g,
                    '\n<h3>$1</h3><div class="license"><strong>$2</strong></div>\n',
                );
            });
        }
    }
}
