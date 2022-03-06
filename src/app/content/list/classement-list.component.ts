import { Component, ViewChild } from '@angular/core';

import { DialogComponent } from 'src/app/components/dialog.component';
import { FormatedInfos } from 'src/app/interface';
import { DBService } from 'src/app/services/db.service';


@Component({
    selector: 'classement-list',
    templateUrl: './classement-list.component.html',
    styleUrls: ['./classement-list.component.scss'],
})
export class ClassementListComponent {
    result!: FormatedInfos[];

    @ViewChild('dialogSuppr') dialogSuppr!: DialogComponent;

    itemCurrent?: FormatedInfos;

    constructor(private dbservice: DBService) {
        this.dbservice.getLocalList().then(result => {
            result.forEach(d => (d.date = new Date(d.date)));
            result.sort((e, f) => (e.date as Date).getTime() - (f.date as Date).getTime());
            this.result = result;
        });
    }

    delete(item: FormatedInfos) {
        this.dialogSuppr.open();
        this.itemCurrent = item;
    }

    deleteCurrent(action: boolean) {
        if (!action) {
            console.log(`Not remove line: ${this.itemCurrent?.id}`);
            this.itemCurrent = undefined;
            this.dialogSuppr.close();
        } else if (this.itemCurrent?.id) {
            this.dbservice.delete(this.itemCurrent.id).then(() => {
                console.log(`Remove line: ${this.itemCurrent?.id}`);
                this.result.splice(this.result.indexOf(this.itemCurrent as FormatedInfos), 1);
                this.itemCurrent = undefined;
                this.dialogSuppr.close();
            });
        }
    }
}
