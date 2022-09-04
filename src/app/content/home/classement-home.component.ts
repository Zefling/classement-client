import { Component } from '@angular/core';

import { environment } from 'src/environments/environment';


@Component({
    selector: 'classement-home',
    templateUrl: './classement-home.component.html',
    styleUrls: ['./classement-home.component.scss'],
})
export class ClassementHomeComponent {
    version = '0.9.6 beta';

    modeApi = environment.api?.active || false;
}
