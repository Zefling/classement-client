import { Component, input } from '@angular/core';

import { OptionGroup } from '../../interface/interface';

@Component({
    selector: 'zone-axis',
    templateUrl: './zone-axis.component.html',
    styleUrls: ['./zone-axis.component.scss'],
})
export class ZoneAxisComponent {
    groups = input<OptionGroup[]>();
}
