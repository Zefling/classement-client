import { Component, inject } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { MemoryService } from 'src/app/services/memory.service';

@Component({
    selector: 'help.bingo',
    templateUrl: './help.bingo.component.html',
    styleUrls: ['./help.bingo.component.scss'],
    imports: [TranslocoModule]
})
export class HelpBingoComponent {
    readonly memory = inject(MemoryService);
}
