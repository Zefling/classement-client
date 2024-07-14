import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'tab-content',
    templateUrl: './tab-content.component.html',
    styleUrls: ['./tab-content.component.scss'],
})
export class TabTitleComponent {
    @HostBinding('attr.id')
    @Input()
    id?: string;

    @Input() selected?: boolean;
}
