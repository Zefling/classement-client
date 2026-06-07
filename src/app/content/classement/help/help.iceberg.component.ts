import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { EditKeyBoardService } from '../../../services/edit.keyboard.service';
import { MemoryService } from '../../../services/memory.service';

@Component({
    selector: 'help.iceberg',
    templateUrl: './help.iceberg.component.html',
    styleUrls: ['./help.iceberg.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslocoModule],
})
export class HelpIcebergComponent {
    readonly memory = inject(MemoryService);
    readonly keyboard = inject(EditKeyBoardService);
}
