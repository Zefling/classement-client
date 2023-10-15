import { Component, Input } from '@angular/core';

import { OptionGroup } from '../../interface/interface';

@Component({
    selector: 'zone-area',
    templateUrl: './zone-area.component.html',
    styleUrls: ['./zone-area.component.scss'],
})
export class ZoneAreaComponent {
    @Input()
    groups?: OptionGroup[];
}
