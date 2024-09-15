import { Component, HostListener, input, model, inject } from '@angular/core';

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
    private readonly tabs = inject(TabsComponent, { host: true });

    id = input<string>();
    selected = model<boolean>(false);

    @HostListener('click')
    onclick() {
        if (this.tabs && this.id()) {
            this.tabs.update(this.id()!);
        }
    }
}
