import { Component, Input } from '@angular/core';

import { Classement } from 'src/app/interface';


@Component({
    selector: 'classement-navigate-result',
    templateUrl: './classement-navigate-result.component.html',
    styleUrls: ['./classement-navigate-result.component.scss'],
})
export class ClassementNavigateResultComponent {
    @Input() classements: Classement[] = [];
    @Input() isCatagoryList = false;
}
