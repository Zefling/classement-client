import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { MemoryService } from 'src/app/services/memory.service';

@Component({
    selector: 'help.iceberg',
    templateUrl: './help.iceberg.component.html',
    styleUrls: ['./help.iceberg.component.scss'],
    imports: [TranslocoModule],
    standalone: true,
})
export class HelpIcebergComponent {
    constructor(public readonly memory: MemoryService) {}
}
