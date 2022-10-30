import { Component, Input } from '@angular/core';


@Component({
    selector: 'tab-content',
    templateUrl: './tab-content.component.html',
    styleUrls: ['./tab-content.component.scss'],
})
export class TabTitleComponent {
    @Input() id?: string;

    @Input() selected?: boolean;
}
