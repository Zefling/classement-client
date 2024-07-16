import { Component, input } from '@angular/core';

/**
 * loader only (without message)
 */
@Component({
    selector: 'loading-cmp',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    host: {
        '[style.--height]': 'size()',
        '[style.--width]': 'tickWidth()',
    },
})
export class LoadingComponent {
    size = input<string>();
    tickWidth = input<string>();
}
