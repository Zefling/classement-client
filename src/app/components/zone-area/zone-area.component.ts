import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Options } from 'src/app/interface/interface';

@Component({
    selector: 'zone-area',
    templateUrl: './zone-area.component.html',
    styleUrls: ['./zone-area.component.scss'],
    imports: [FormsModule],
})
export class ZoneAreaComponent {
    readonly options = input.required<Options>();
}
