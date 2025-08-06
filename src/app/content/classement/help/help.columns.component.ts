import { Component, inject } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { EditKeyBoardService } from 'src/app/services/edit.keyboard.service';
import { MemoryService } from 'src/app/services/memory.service';

@Component({
    selector: 'help.columns',
    templateUrl: './help.columns.component.html',
    styleUrls: ['./help.columns.component.scss'],
    imports: [TranslocoModule],
})
export class HelpColumnsComponent {
    readonly memory = inject(MemoryService);
    readonly keyboard = inject(EditKeyBoardService);
}
