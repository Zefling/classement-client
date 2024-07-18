import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

@Component({
    selector: 'third-party-licenses',
    templateUrl: './licenses.component.html',
    styleUrls: ['./licenses.component.scss'],
})
export class LicensesComponent {
    data!: string;

    private listener = Subscriptions.instance();

    constructor(
        private readonly http: HttpClient,
        private readonly global: GlobalService,
        private readonly translate: TranslocoService,
    ) {
        if (this.global.licenses) {
            this.data = this.global.licenses;
        } else {
            this.http.get('./3rdpartylicenses.txt', { responseType: 'text' }).subscribe(data => {
                this.data = this.global.licenses = data
                    .replace(/Package: (.*)\n/g, '<h3>$1</h3>')
                    .replace(/License: "(.*)"\n/g, '<div class="license">$1</div><p>')
                    .replace(/--*-/g, '</p></div><div class="block">')
                    .replace(/<p>\s*<\/p>/g, '')
                    .replace(/^<\/p><\/div>|<div class="block">\s*$/g, '');
            });
        }
        this.listener.push(
            this.translate.langChanges$.subscribe(() => {
                this.updateTitle();
            }),
        );
    }

    updateTitle() {
        this.global.setTitle('menu.licenses');
    }
}
