import { Component, inject } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { MemoryService } from 'src/app/services/memory.service';

@Component({
    selector: 'help.axis',
    templateUrl: './help.axis.component.html',
    styleUrls: ['./help.axis.component.css'],
    imports: [TranslocoModule],
})
export class HelpAxisComponent {
    readonly memory = inject(MemoryService);
}
