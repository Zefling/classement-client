import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Options } from 'src/app/interface/interface';

@Component({
    selector: 'zone-axis',
    templateUrl: './zone-axis.component.html',
    styleUrls: ['./zone-axis.component.scss'],
    imports: [FormsModule],
})
export class ZoneAxisComponent {
    readonly options = input.required<Options>();
}
