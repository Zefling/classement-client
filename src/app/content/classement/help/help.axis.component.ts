import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { MemoryService } from 'src/app/services/memory.service';

@Component({
    selector: 'help.axis',
    templateUrl: './help.axis.component.html',
    styleUrls: ['./help.axis.component.scss'],
    imports: [TranslocoModule],
    standalone: true,
})
export class HelpAxisComponent {
    constructor(public readonly memory: MemoryService) {}
}
