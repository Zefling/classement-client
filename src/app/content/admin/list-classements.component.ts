import { Component, Input, ViewChild } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { DialogComponent } from 'src/app/components/dialog.component';
import { MessageService } from 'src/app/components/info-messages.component';
import { Classement } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';


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

    constructor(
        private classementService: APIClassementService,
        private messageService: MessageService,
        private translate: TranslateService,
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
            .adminStatusClassement(this.currentClassement!.rankingId, status, type)
            .then(() => {
                let typeName: string;
                let stat: 'deleted' | 'hidden';

                if (type === 'delete') {
                    typeName = status ? 'deleted' : 'restored';
                    stat = 'deleted';
                } else if (type === 'hide') {
                    typeName = status ? 'hidden' : 'showed';
                    stat = 'hidden';
                }

                this.currentClassement![stat!] = status;
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
