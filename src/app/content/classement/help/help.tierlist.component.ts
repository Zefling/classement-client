import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { MemoryService } from 'src/app/services/memory.service';

@Component({
    selector: 'help.tierlist',
    templateUrl: './help.tierlist.component.html',
    styleUrls: ['./help.tierlist.component.scss'],
    imports: [TranslocoModule],
    standalone: true,
})
export class HelpTierListComponent {
    constructor(public readonly memory: MemoryService) {}
}
