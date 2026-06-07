import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { EditKeyBoardService } from '../../../services/edit.keyboard.service';
import { MemoryService } from '../../../services/memory.service';

@Component({
    selector: 'help.tierlist',
    templateUrl: './help.tierlist.component.html',
    styleUrls: ['./help.tierlist.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslocoModule],
})
export class HelpTierListComponent {
    readonly memory = inject(MemoryService);
    readonly keyboard = inject(EditKeyBoardService);
}
