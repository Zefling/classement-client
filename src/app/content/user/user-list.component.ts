import { Component, ViewChild } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MessageService } from 'src/app/components/info-messages/info-messages.component';
import { Classement, User } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';


@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
    @ViewChild('dialogRemoveClassement') dialogRemoveClassement!: DialogComponent;
    currentClassement?: Classement;

    user?: User;

    constructor(
        private classementService: APIClassementService,
        private userService: APIUserService,
        private messageService: MessageService,
        private translate: TranslateService,
    ) {
        this.user = this.userService.user;
    }

    delete(classement: Classement): void {
        this.currentClassement = classement;
        this.dialogRemoveClassement.open();
    }

    deleteCurrentClassement(remove: boolean): void {
        if (remove) {
            this.classementService.deleteClassement(this.currentClassement!.rankingId).then(() => {
                this.user?.classements?.splice(this.user?.classements?.indexOf(this.currentClassement!), 1);
                this.messageService.addMessage(this.translate.instant('message.server.deleted.success'));
                this.currentClassement = undefined;
            });
        } else {
            this.currentClassement = undefined;
        }
        this.dialogRemoveClassement.close();
    }
}
