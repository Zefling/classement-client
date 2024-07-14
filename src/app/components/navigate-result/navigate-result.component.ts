import { Component, HostBinding, Input, booleanAttribute, input } from '@angular/core';

import { Classement } from 'src/app/interface/interface';

@Component({
    selector: 'navigate-result',
    templateUrl: './navigate-result.component.html',
    styleUrls: ['./navigate-result.component.scss'],
})
export class NavigateResultComponent {
    classements = input<Classement[]>([]);
    hideDerivatives = input<boolean, any>(false, { transform: booleanAttribute });
    hideUser = input<boolean, any>(false, { transform: booleanAttribute });
    onlyRanking = input<boolean, any>(false, { transform: booleanAttribute });

    @HostBinding('class.categories')
    @Input({ transform: booleanAttribute })
    isCategoryList = false;

    @HostBinding('class.list')
    @Input({ transform: booleanAttribute })
    isHomeList = false;
}
