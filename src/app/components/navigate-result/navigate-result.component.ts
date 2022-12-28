import { Component, Input } from '@angular/core';

import { Classement } from 'src/app/interface';

@Component({
    selector: 'navigate-result',
    templateUrl: './navigate-result.component.html',
    styleUrls: ['./navigate-result.component.scss'],
})
export class NavigateResultComponent {
    @Input() classements: Classement[] = [];
    @Input() isCatagoryList = false;
    @Input() hideDerivatives = false;
}
