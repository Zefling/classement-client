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
    standalone: true,
})
export class LoadingComponent {
    // input

    readonly size = input<string>();
    readonly tickWidth = input<string>();
}
