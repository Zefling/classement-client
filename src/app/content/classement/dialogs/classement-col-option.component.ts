import { ChangeDetectorRef, Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MagmaColorPicker, MagmaDialog, MagmaInput, MagmaInputCheckbox, MagmaInputElement } from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { ImagePickComponent } from '../../../components/image-pick/image-pick.component';
import { ColOption } from '../../../interface/interface';

@Component({
    selector: 'classement-col-option',
    templateUrl: './classement-col-option.component.html',
    styleUrls: ['./classement-col-option.component.scss'],
    imports: [
        FormsModule,
        TranslocoPipe,
        MagmaColorPicker,
        MagmaInput,
        MagmaInputCheckbox,
        MagmaInputElement,
        ImagePickComponent,
    ],
})
export class ClassementColOptionComponent {
    private readonly cd = inject(ChangeDetectorRef);

    currentCol = input<ColOption>();
    dialog = input<MagmaDialog>();

    globalChange = output<void>();
    colLeft = output<number>();
    colRight = output<number>();
    colDelete = output<number>();
    colAdd = output<number>();

    onBgImageChange(value: string | undefined): void {
        const col = this.currentCol();
        if (!col) return;
        col.col.bgImage = value;
        this.cd.markForCheck();
        this.globalChange.emit();
    }
}
