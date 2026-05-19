import { ChangeDetectionStrategy, Component, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MagmaDialog, MagmaInput, MagmaInputCheckbox } from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
    selector: 'classement-clear',
    templateUrl: './classement-clear.component.html',
    styleUrls: ['./classement-clear.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, TranslocoPipe, MagmaDialog, MagmaInput, MagmaInputCheckbox],
})
export class ClassementClearComponent {
    dialogClear = viewChild.required<MagmaDialog>('dialogClear');

    randomize = false;

    reset = output<boolean>();

    open() {
        this.dialogClear().open();
    }

    close() {
        this.reset.emit(this.randomize);
        this.dialogClear().close();
    }
}
