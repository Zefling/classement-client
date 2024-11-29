import { Component, input } from '@angular/core';

import { OptionGroup } from '../../interface/interface';

@Component({
    selector: 'zone-area',
    templateUrl: './zone-area.component.html',
    styleUrls: ['./zone-area.component.css'],
    standalone: true,
})
export class ZoneAreaComponent {
    readonly groups = input<OptionGroup[]>();
}
