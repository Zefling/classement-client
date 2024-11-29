import { Component, input } from '@angular/core';

import { OptionGroup } from '../../interface/interface';

@Component({
    selector: 'zone-axis',
    templateUrl: './zone-axis.component.html',
    styleUrls: ['./zone-axis.component.css'],
    standalone: true,
})
export class ZoneAxisComponent {
    readonly groups = input<OptionGroup[]>();
}
