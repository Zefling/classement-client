import { Component, Host, HostBinding, HostListener, Input } from '@angular/core';

import { TabsComponent } from './tabs.component';


@Component({
    selector: 'tab-title',
    templateUrl: './tab-title.component.html',
    styleUrls: ['./tab-title.component.scss'],
})
export class TabContentComponent {
    @Input() id?: string;

    @HostBinding('class.selected')
    @Input()
    selected?: boolean;

    constructor(@Host() private tabs: TabsComponent) {}

    @HostListener('click')
    onclick() {
        if (this.id) {
            this.tabs.update(this.id);
        }
    }
}
