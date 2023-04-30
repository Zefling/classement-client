import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
    selector: 'third-party-licenses',
    templateUrl: './licenses.component.html',
    styleUrls: ['./licenses.component.scss'],
})
export class LicensesComponent {
    data!: string;

    constructor(private http: HttpClient) {
        this.http.get('./3rdpartylicenses.txt', { responseType: 'text' }).subscribe(data => {
            this.data = data.replace(
                /([^\n]*)\n(MIT|Apache-2.0|0BSD|BSD-3-Clause)\n/g,
                '\n<h3>$1</h3><div class="license"><strong>$2</strong></div>\n',
            );
        });
    }
}
