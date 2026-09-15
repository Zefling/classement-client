import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MagmaColorPicker, MagmaDialog } from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { GroupOption, ModeNames } from '../../../interface/interface';

@Component({
    selector: 'classement-group-option',
    templateUrl: './classement-group-option.component.html',
    styleUrls: ['./classement-group-option.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, TranslocoPipe, MagmaColorPicker],
    host: {
        '[class]': "'mode-' +mode()",
    },
})
export class ClassementGroupOptionComponent {
    currentGroup = input<GroupOption>();
    dialog = input<MagmaDialog>();
    mode = input<ModeNames>();

    globalChange = output<void>();
    upLine = output<number>();
    downLine = output<number>();
    deleteLine = output<number>();
    addLine = output<number>();
}
