import { Component, inject } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { EditKeyBoardService } from 'src/app/services/edit.keyboard.service';
import { MemoryService } from 'src/app/services/memory.service';

@Component({
    selector: 'help.tierlist',
    templateUrl: './help.tierlist.component.html',
    styleUrls: ['./help.tierlist.component.scss'],
    imports: [TranslocoModule],
})
export class HelpTierListComponent {
    readonly memory = inject(MemoryService);
    readonly keyboard = inject(EditKeyBoardService);
}
