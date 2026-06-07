import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MagmaClickEnterDirective } from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { Classement } from '../../interface/interface';

@Component({
    selector: 'navigate-result',
    templateUrl: './navigate-result.component.html',
    styleUrls: ['./navigate-result.component.scss'],
    host: {
        '[class.categories]': 'isCategoryList()',
        '[class.list]': 'isHomeList()',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, DatePipe, TranslocoPipe, MagmaClickEnterDirective],
})
export class NavigateResultComponent {
    // input

    readonly classements = input<Classement[]>([]);
    readonly hideDerivatives = input<boolean, any>(false, { transform: booleanAttribute });
    readonly hideUser = input<boolean, any>(false, { transform: booleanAttribute });
    readonly onlyRanking = input<boolean, any>(false, { transform: booleanAttribute });
    readonly isAction = input(false, { transform: booleanAttribute });

    // input / host

    readonly isCategoryList = input<boolean, any>(false, { transform: booleanAttribute });
    readonly isHomeList = input<boolean, any>(false, { transform: booleanAttribute });

    action = output<Classement>();
}
