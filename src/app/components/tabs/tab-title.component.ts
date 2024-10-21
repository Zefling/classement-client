import { ChangeDetectionStrategy, Component, HostListener, inject, input, model } from '@angular/core';

import { TabsComponent } from './tabs.component';

@Component({
    selector: 'tab-title',
    templateUrl: './tab-title.component.html',
    styleUrls: ['./tab-title.component.scss'],
    host: {
        '[attr.id]': 'id()',
        '[class.selected]': 'selected()',
    },
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabTitleComponent {
    // inject

    private readonly tabs = inject(TabsComponent, { host: true });

    // input

    readonly id = input<string>();
    readonly selected = model<boolean>(false);

    @HostListener('click')
    onclick() {
        if (this.tabs && this.id()) {
            this.tabs.update(this.id()!);
        }
    }
}
