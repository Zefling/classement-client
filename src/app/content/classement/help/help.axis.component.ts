import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'help.axis',
    templateUrl: './help.axis.component.html',
    styleUrls: ['./help.axis.component.scss'],
    imports: [TranslocoModule],
    standalone: true,
})
export class HelpAxisComponent {}
