import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { MemoryService } from 'src/app/services/momory.service';

@Component({
    selector: 'help.bingo',
    templateUrl: './help.bingo.component.html',
    styleUrls: ['./help.bingo.component.scss'],
    imports: [TranslocoModule],
    standalone: true,
})
export class HelpBingoComponent {
    constructor(public readonly memory: MemoryService) {}
}
