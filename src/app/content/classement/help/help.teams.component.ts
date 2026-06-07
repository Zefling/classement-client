import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { EditKeyBoardService } from '../../../services/edit.keyboard.service';
import { MemoryService } from '../../../services/memory.service';

@Component({
    selector: 'help.teams',
    templateUrl: './help.teams.component.html',
    styleUrls: ['./help.teams.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslocoModule],
})
export class HelpTeamsComponent {
    readonly memory = inject(MemoryService);
    readonly keyboard = inject(EditKeyBoardService);
}
