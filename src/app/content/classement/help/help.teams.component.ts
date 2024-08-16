import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { MemoryService } from 'src/app/services/memory.service';

@Component({
    selector: 'help.teams',
    templateUrl: './help.teams.component.html',
    styleUrls: ['./help.teams.component.scss'],
    imports: [TranslocoModule],
    standalone: true,
})
export class HelpTeamsComponent {
    constructor(public readonly memory: MemoryService) {}
}
