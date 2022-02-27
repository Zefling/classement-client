import { Component } from '@angular/core';

import { FormatedInfos } from 'src/app/interface';
import { DBService } from 'src/app/services/db.service';


@Component({
    selector: 'classement-list',
    templateUrl: './classement-list.component.html',
    styleUrls: ['./classement-list.component.scss'],
})
export class ClassementListComponent {
    result!: FormatedInfos[];

    constructor(private dbservice: DBService) {
        this.dbservice.getLocalList().then(result => {
            result.forEach(d => (d.date = new Date(d.date)));
            result.sort((e, f) => (e.date as Date).getTime() - (f.date as Date).getTime());
            this.result = result;
        });
    }

    delete(item: FormatedInfos) {
        if (item.id) {
            this.dbservice.delete(item.id).then(() => {
                console.log('Remove line');
                this.result.splice(this.result.indexOf(item), 1);
            });
        }
    }
}
