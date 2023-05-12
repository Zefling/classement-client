import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MessageService } from 'src/app/components/info-messages/info-messages.component';
import { Classement } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { Utils } from 'src/app/tools/utils';

@Component({
    selector: 'list-classements',
    templateUrl: './list-classements.component.html',
    styleUrls: ['./list-classements.component.scss'],
})
export class ListClassementsComponent {
    @Input() classements?: Classement[];

    @ViewChild('dialogActionsClassement') dialogActionsClassement!: DialogComponent;
    @ViewChild('dialogSeeClassement') dialogSeeClassement!: DialogComponent;

    currentClassement?: Classement;

    class?: Classement;

    @Output()
    updateClassements = new EventEmitter<Classement[]>();

    constructor(
        private readonly classementService: APIClassementService,
        private readonly messageService: MessageService,
        private readonly translate: TranslateService,
    ) {}

    see(classement: Classement) {
        this.currentClassement = classement;
        this.dialogSeeClassement.open();
    }

    update(classement: Classement): void {
        this.currentClassement = classement;
        this.dialogActionsClassement.open();
    }

    changeStatusCurrentClassement(status: boolean, type: 'delete' | 'hide'): void {
        this.classementService
            .statusClassement(this.currentClassement!.rankingId, status, type, true)
            .then(classements => {
                this.updateClassements.next(classements);
                let typeName: string;

                if (type === 'delete') {
                    typeName = status ? 'deleted' : 'restored';
                } else if (type === 'hide') {
                    typeName = status ? 'hidden' : 'showed';
                }

                Utils.updateClassements(this.classements, classements);

                this.messageService.addMessage(this.translate.instant(`message.server.${typeName!}.success`));
                this.changeStatusCancel();
            })
            .catch(e => {});
    }

    changeStatusCancel() {
        this.currentClassement = undefined;
        this.dialogActionsClassement.close();
    }
}
