import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { DialogComponent } from 'src/app/components/dialog.component';
import { MessageService } from 'src/app/components/info-messages.component';
import { FormatedInfos } from 'src/app/interface';
import { DBService } from 'src/app/services/db.service';


@Component({
    selector: 'classement-list',
    templateUrl: './classement-list.component.html',
    styleUrls: ['./classement-list.component.scss'],
})
export class ClassementListComponent {
    @ViewChild('dialogDelete') dialogDelete!: DialogComponent;
    @ViewChild('dialogClone') dialogClone!: DialogComponent;

    result!: FormatedInfos[];

    itemCurrent?: FormatedInfos;

    constructor(
        private dbservice: DBService,
        private router: Router,
        private translate: TranslateService,
        private messageService: MessageService,
    ) {
        this.showList();
    }

    showList() {
        this.dbservice.getLocalList().then(result => {
            result.forEach(d => (d.date = new Date(d.date)));
            result.sort((e, f) => (e.date as Date).getTime() - (f.date as Date).getTime());
            this.result = result;
        });
    }

    delete(item: FormatedInfos) {
        this.dialogDelete.open();
        this.itemCurrent = item;
    }

    clone(item: FormatedInfos) {
        this.dialogClone.open();
        this.itemCurrent = item;
    }

    deleteCurrent(action: boolean) {
        if (!action) {
            console.log(`Not remove line: ${this.itemCurrent?.id}`);
            this.itemCurrent = undefined;
            this.dialogDelete.close();
        } else if (this.itemCurrent?.id) {
            this.dbservice.delete(this.itemCurrent.id).then(() => {
                console.log(`Remove line: ${this.itemCurrent?.id}`);
                this.result.splice(this.result.indexOf(this.itemCurrent as FormatedInfos), 1);
                this.messageService.addMessage(
                    this.translate
                        .instant('message.remove.succes')
                        .replace('%title%', this._getTitle(this.itemCurrent!)),
                );
                this.itemCurrent = undefined;
                this.dialogDelete.close();
            });
        }
    }

    cloneCurrent(action: boolean, value?: string, edit: boolean = false) {
        if (!action) {
            console.log(`Not clone line: ${this.itemCurrent?.id}`);
            this.itemCurrent = undefined;
            this.dialogClone.close();
        } else if (this.itemCurrent?.id) {
            this.dbservice.clone(this.itemCurrent, value || '').then(item => {
                console.log(`Clone line: ${this.itemCurrent?.id} en ${item.id}`);

                this.messageService.addMessage(
                    this.translate
                        .instant('message.clone.succes')
                        .replace('%title%', this._getTitle(this.itemCurrent!)),
                );
                this.itemCurrent = undefined;
                this.dialogClone.close();
                if (edit) {
                    this.router.navigate(['/edit/' + item.id]);
                } else {
                    this.result.push(item);
                }
            });
        }
    }

    private _getTitle(info: FormatedInfos) {
        return info?.options?.title.trim() || this.translate.instant('list.title.undefined');
    }
}
