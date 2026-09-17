import { Component, inject } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { EditKeyBoardService } from '../../../services/edit.keyboard.service';
import { MemoryService } from '../../../services/memory.service';

@Component({
    selector: 'help.table',
    templateUrl: './help.table.component.html',
    styleUrls: ['./help.table.component.scss'],
    imports: [TranslocoModule],
})
export class HelpTableComponent {
    readonly memory = inject(MemoryService);
    readonly keyboard = inject(EditKeyBoardService);
}
