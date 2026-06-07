import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MagmaColorPicker, MagmaDialog } from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { GroupOption } from '../../../interface/interface';

@Component({
    selector: 'classement-group-option',
    templateUrl: './classement-group-option.component.html',
    styleUrls: ['./classement-group-option.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, TranslocoPipe, MagmaColorPicker],
})
export class ClassementGroupOptionComponent {
    currentGroup = input<GroupOption>();
    dialog = input<MagmaDialog>();

    globalChange = output<void>();
    upLine = output<number>();
    downLine = output<number>();
    deleteLine = output<number>();
    addLine = output<number>();
}
