import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'help.bingo',
    templateUrl: './help.bingo.component.html',
    styleUrls: ['./help.bingo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslocoModule],
})
export class HelpBingoEmojiComponent {}
