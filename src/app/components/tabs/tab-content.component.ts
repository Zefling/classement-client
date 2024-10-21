import { Component, input, model } from '@angular/core';

@Component({
    selector: 'tab-content',
    templateUrl: './tab-content.component.html',
    styleUrls: ['./tab-content.component.scss'],
    host: {
        '[attr.id]': 'id()',
    },
    standalone: true,
})
export class TabContentComponent {
    // input

    readonly id = input<string>();
    readonly selected = model<boolean>(false);
}
