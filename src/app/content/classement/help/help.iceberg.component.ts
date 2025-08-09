import { Component, inject } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { EditKeyBoardService } from 'src/app/services/edit.keyboard.service';
import { MemoryService } from 'src/app/services/memory.service';

@Component({
    selector: 'help.iceberg',
    templateUrl: './help.iceberg.component.html',
    styleUrls: ['./help.iceberg.component.scss'],
    imports: [TranslocoModule],
})
export class HelpIcebergComponent {
    readonly memory = inject(MemoryService);
    readonly keyboard = inject(EditKeyBoardService);
}
