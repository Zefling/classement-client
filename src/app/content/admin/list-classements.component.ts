import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Output, inject, input, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
    MagmaClickEnterDirective,
    MagmaDialog,
    MagmaInput,
    MagmaInputElement,
    MagmaInputSelect,
    MagmaInputText,
    MagmaMessage,
    MagmaTable,
    MagmaTableCell,
    MagmaTableGroup,
    MagmaTableRow,
} from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { Select2Option } from 'ng-select2-component';
import { MarkdownModule } from 'ngx-markdown';

import { ClassementInfosComponent } from 'src/app/components/classement-infos/classement-infos.component';
import { TileComponent } from 'src/app/components/tile/tile.component';
import { Classement, SortClassementCol, SortDirection } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { GlobalService } from 'src/app/services/global.service';
import { Utils } from 'src/app/tools/utils';

import { SeeClassementComponent } from '../../components/see-classement/see-classement.component';
import { categories } from '../classement/classement-default';

@Component({
    selector: 'list-classements',
    templateUrl: './list-classements.component.html',
    styleUrls: ['./list-classements.component.scss'],
    imports: [
        SeeClassementComponent,
        ClassementInfosComponent,
        FormsModule,
        DatePipe,
        TranslocoPipe,
        MagmaDialog,
        MagmaTable,
        MagmaTableGroup,
        MagmaTableRow,
        MagmaTableCell,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaInputSelect,
        MagmaClickEnterDirective,
        MarkdownModule,
        TileComponent,
    ],
})
export class ListClassementsComponent {
    private readonly classementService = inject(APIClassementService);
    private readonly mgMessage = inject(MagmaMessage);
    private readonly globalService = inject(GlobalService);
    private readonly translate = inject(TranslocoService);

    classements = input<Classement[]>();
    sort = input<SortClassementCol>();
    direction = input<SortDirection>();

    dialogActionsClassement = viewChild.required<MagmaDialog>('dialogActionsClassement');
    dialogSeeClassement = viewChild.required<MagmaDialog>('dialogSeeClassement');
    dialogEditCategory = viewChild.required<MagmaDialog>('dialogEditCategory');

    currentClassement?: Classement;

    class?: Classement;
    catagories = categories;
    catagoriesList = categories.map<Select2Option>(cat => ({ label: cat, value: cat }));

    @Output()
    updateClassements = new EventEmitter<Classement[]>();

    @Output()
    sortUpdate = new EventEmitter<SortClassementCol>();

    see(classement: Classement) {
        this.currentClassement = classement;
        Utils.formattedTilesByMode(classement.data.options, classement.data.groups, classement.data.list);
        this.globalService.updateVarCss(classement.data.options);
        this.dialogSeeClassement().open();
    }

    update(classement: Classement): void {
        this.currentClassement = classement;
        this.dialogActionsClassement().open();
    }

    editCategory(classement: Classement) {
        this.currentClassement = classement;
        this.dialogEditCategory().open();
    }

    changeStatusCurrentClassement(status: boolean | string, type: 'delete' | 'hide' | 'category' | 'adult'): void {
        this.classementService
            .statusClassement(this.currentClassement!.rankingId, status, type, true)
            .then(classements => {
                this.updateClassements.next(classements);
                let typeName: string;

                if (type === 'delete') {
                    typeName = status ? 'deleted' : 'restored';
                } else if (type === 'hide') {
                    typeName = status ? 'hidden' : 'showed';
                } else if (type === 'adult') {
                    typeName = status ? 'adult' : 'for.all';
                } else if (type === 'category') {
                    typeName = type;
                }

                if (type === 'delete' || type === 'hide' || type === 'adult') {
                    Utils.updateClassements(this.classements(), classements);
                    this.changeStatusCancel();
                } else if (type === 'category') {
                    this.classements()?.forEach(e => {
                        if (e.templateId === this.currentClassement!.templateId) {
                            e.category = status as string;
                        }
                    });
                    this.changeCategoryCancel();
                }

                this.mgMessage.addMessage(this.translate.translate(`message.server.${typeName!}.success`));
            })
            .catch(e => {});
    }

    changeStatusCancel() {
        this.currentClassement = undefined;
        this.dialogActionsClassement().close();
    }

    changeCategoryCancel() {
        this.currentClassement = undefined;
        this.dialogEditCategory().close();
    }
}
