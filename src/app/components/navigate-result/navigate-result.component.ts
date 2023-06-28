import { Component, HostBinding, Input, booleanAttribute } from '@angular/core';

import { Classement } from 'src/app/interface';

@Component({
    selector: 'navigate-result',
    templateUrl: './navigate-result.component.html',
    styleUrls: ['./navigate-result.component.scss'],
})
export class NavigateResultComponent {
    @Input() classements: Classement[] = [];

    @Input({ transform: booleanAttribute }) hideDerivatives = false;

    @Input({ transform: booleanAttribute }) hideUser = false;

    @Input({ transform: booleanAttribute }) onlyRanking = false;

    @HostBinding('class.categories')
    @Input({ transform: booleanAttribute })
    isCatagoryList = false;
}
