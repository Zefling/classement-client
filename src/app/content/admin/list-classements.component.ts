import { Component, EventEmitter, input, Output, viewChild } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MessageService } from 'src/app/components/info-messages/info-messages.component';
import { Classement, SortClassementCol, SortDirection } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { Utils } from 'src/app/tools/utils';

import { GlobalService } from 'src/app/services/global.service';
import { categories } from '../classement/classement-default';

@Component({
    selector: 'list-classements',
    templateUrl: './list-classements.component.html',
    styleUrls: ['./list-classements.component.scss'],
})
export class ListClassementsComponent {
    classements = input<Classement[]>();
    sort = input<SortClassementCol>();
    direction = input<SortDirection>();

    dialogActionsClassement = viewChild.required<DialogComponent>('dialogActionsClassement');
    dialogSeeClassement = viewChild.required<DialogComponent>('dialogSeeClassement');
    dialogEditCategory = viewChild.required<DialogComponent>('dialogEditCategory');

    currentClassement?: Classement;

    class?: Classement;
    catagories = categories;

    @Output()
    updateClassements = new EventEmitter<Classement[]>();

    @Output()
    sortUpdate = new EventEmitter<SortClassementCol>();

    constructor(
        private readonly classementService: APIClassementService,
        private readonly messageService: MessageService,
        private readonly globalService: GlobalService,
        private readonly translate: TranslocoService,
    ) {}

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

    changeStatusCurrentClassement(status: boolean | string, type: 'delete' | 'hide' | 'category'): void {
        this.classementService
            .statusClassement(this.currentClassement!.rankingId, status, type, true)
            .then(classements => {
                this.updateClassements.next(classements);
                let typeName: string;

                if (type === 'delete') {
                    typeName = status ? 'deleted' : 'restored';
                } else if (type === 'hide') {
                    typeName = status ? 'hidden' : 'showed';
                } else if (type === 'category') {
                    typeName = type;
                }

                if (type === 'delete' || type === 'hide') {
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

                this.messageService.addMessage(this.translate.translate(`message.server.${typeName!}.success`));
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
