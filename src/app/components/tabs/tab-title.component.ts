import { Component, Host, HostListener, input, model } from '@angular/core';

import { TabsComponent } from './tabs.component';

@Component({
    selector: 'tab-title',
    templateUrl: './tab-title.component.html',
    styleUrls: ['./tab-title.component.scss'],
    host: {
        '[attr.id]': 'id()',
        '[class.selected]': 'selected()',
    },
})
export class TabContentComponent {
    id = input<string>();
    selected = model<boolean>(false);

    constructor(@Host() private readonly tabs: TabsComponent) {}

    @HostListener('click')
    onclick() {
        if (this.tabs && this.id()) {
            this.tabs.update(this.id()!);
        }
    }
}
