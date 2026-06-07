import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { EditKeyBoardService } from '../../../services/edit.keyboard.service';
import { MemoryService } from '../../../services/memory.service';

@Component({
    selector: 'help.axis',
    templateUrl: './help.axis.component.html',
    styleUrls: ['./help.axis.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslocoModule],
})
export class HelpAxisComponent {
    readonly memory = inject(MemoryService);
    readonly keyboard = inject(EditKeyBoardService);
}
