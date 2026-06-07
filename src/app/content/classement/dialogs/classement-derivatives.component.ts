import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MagmaClickEnterDirective, MagmaDialog, MagmaTableModule } from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { Classement } from '../../../interface/interface';
import { Utils } from '../../../tools/utils';

@Component({
    selector: 'classement-derivatives',
    templateUrl: './classement-derivatives.component.html',
    styleUrls: ['./classement-derivatives.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe, TranslocoPipe, MagmaDialog, MagmaClickEnterDirective, MagmaTableModule],
})
export class ClassementDerivativesComponent {
    private readonly router = inject(Router);

    dialogDerivatives = viewChild.required<MagmaDialog>('dialogDerivatives');

    derivatives = input<Classement[]>();
    currentRankingId = input<string>();

    open() {
        this.dialogDerivatives().open();
    }

    close() {
        this.dialogDerivatives().close();
    }

    loadDerivativeClassement(classement: Classement) {
        this.router.navigate(['edit', Utils.getClassementId(classement)]);
        this.close();
    }
}
