import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MagmaDialog, MagmaInput, MagmaInputTextarea } from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'classement-texts',
    templateUrl: './classement-texts.component.html',
    styleUrls: ['./classement-texts.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, TranslocoPipe, MagmaDialog, MagmaInput, MagmaInputTextarea],
})
export class ClassementTextsComponent {
    private readonly global = inject(GlobalService);

    dialogTexts = viewChild.required<MagmaDialog>('dialogTexts');

    inputTexts = '';

    open() {
        this.dialogTexts().open();
    }

    close() {
        this.inputTexts = '';
        this.dialogTexts().close();
    }

    addTexts() {
        this.global.addTexts(this.inputTexts);
        this.close();
    }
}
