import { Component, inject } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { MemoryService } from 'src/app/services/memory.service';

@Component({
    selector: 'help.iceberg',
    templateUrl: './help.iceberg.component.html',
    styleUrls: ['./help.iceberg.component.css'],
    imports: [TranslocoModule],
})
export class HelpIcebergComponent {
    readonly memory = inject(MemoryService);
}
