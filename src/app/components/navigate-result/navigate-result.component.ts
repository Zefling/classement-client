import { Component, booleanAttribute, input } from '@angular/core';

import { Classement } from 'src/app/interface/interface';

@Component({
    selector: 'navigate-result',
    templateUrl: './navigate-result.component.html',
    styleUrls: ['./navigate-result.component.scss'],
    host: {
        '[class.categories]': 'isCategoryList()',
        '[class.list]': 'isHomeList()',
    },
})
export class NavigateResultComponent {
    classements = input<Classement[]>([]);
    hideDerivatives = input<boolean, any>(false, { transform: booleanAttribute });
    hideUser = input<boolean, any>(false, { transform: booleanAttribute });
    onlyRanking = input<boolean, any>(false, { transform: booleanAttribute });

    // host
    isCategoryList = input<boolean, any>(false, { transform: booleanAttribute });
    isHomeList = input<boolean, any>(false, { transform: booleanAttribute });
}
