import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'help.iceberg',
    templateUrl: './help.iceberg.component.html',
    styleUrls: ['./help.iceberg.component.scss'],
    imports: [TranslocoModule],
    standalone: true,
})
export class HelpIcebergComponent {}
