import { Component, input, model } from '@angular/core';

@Component({
    selector: 'tab-content',
    templateUrl: './tab-content.component.html',
    styleUrls: ['./tab-content.component.scss'],
    host: {
        '[attr.id]': 'id()',
    },
})
export class TabTitleComponent {
    id = input<string>();
    selected = model<boolean>(false);
}
