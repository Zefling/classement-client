import { Component, inject } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { MemoryService } from 'src/app/services/memory.service';

@Component({
    selector: 'help.teams',
    templateUrl: './help.teams.component.html',
    styleUrls: ['./help.teams.component.scss'],
    imports: [TranslocoModule]
})
export class HelpTeamsComponent {
    readonly memory = inject(MemoryService);
}
