import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog.component';
import { MessageService } from 'src/app/components/info-messages.component';
import { Classement } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';


@Component({
    selector: 'admin-classements',
    templateUrl: './admin-classements.component.html',
    styleUrls: ['./admin-classements.component.scss'],
})
export class AdminClassementsComponent implements OnDestroy {
    private _sub: Subscription[] = [];

    classements: { [key: number]: Classement[] } = {};
    total?: number = 0;
    page = 0;

    @ViewChild('dialogActionsClassement') dialogActionsClassement!: DialogComponent;
    @ViewChild('dialogSeeClassement') dialogSeeClassement!: DialogComponent;

    currentClassement?: Classement;

    constructor(
        private classementService: APIClassementService,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private translate: TranslateService,
    ) {
        this._sub.push(
            this.route.queryParams.subscribe(params => {
                const page = params['page'] || 1;
                this.pageUpdate(page);
            }),
        );
    }

    ngOnDestroy() {
        this._sub.forEach(e => e.unsubscribe());
    }

    pageUpdate(page: number) {
        if (!this.classements[page]) {
            this.classementService.adminGetClassements(page).then(result => {
                this.total = result.total;
                this.page = page;
                this.classements[page] = result.list;
            });
        } else {
            this.page = page;
        }
    }

    see(classement: Classement) {
        this.currentClassement = classement;
        this.dialogSeeClassement.open();
    }

    update(classement: Classement): void {
        this.currentClassement = classement;
        this.dialogActionsClassement.open();
    }

    changeStatusCurrentClassement(status: boolean, type: 'delete' | 'hide'): void {
        this.classementService.adminStatusClassement(this.currentClassement!.rankingId, status, type).then(() => {
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
        });
    }

    changeStatusCancel() {
        this.currentClassement = undefined;
        this.dialogActionsClassement.close();
    }
}
