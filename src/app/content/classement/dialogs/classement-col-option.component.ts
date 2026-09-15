import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MagmaColorPicker, MagmaDialog, MagmaInput, MagmaInputCheckbox, MagmaInputElement } from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { ColOption } from '../../../interface/interface';

@Component({
    selector: 'classement-col-option',
    templateUrl: './classement-col-option.component.html',
    styleUrls: ['./classement-col-option.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, TranslocoPipe, MagmaColorPicker, MagmaInput, MagmaInputCheckbox, MagmaInputElement],
})
export class ClassementColOptionComponent {
    currentCol = input<ColOption>();
    dialog = input<MagmaDialog>();

    globalChange = output<void>();
    colLeft = output<number>();
    colRight = output<number>();
    colDelete = output<number>();
    colAdd = output<number>();
}
