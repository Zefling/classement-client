import { Component, inject } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { MemoryService } from 'src/app/services/memory.service';

@Component({
    selector: 'help.tierlist',
    templateUrl: './help.tierlist.component.html',
    styleUrls: ['./help.tierlist.component.css'],
    imports: [TranslocoModule],
})
export class HelpTierListComponent {
    readonly memory = inject(MemoryService);
}
