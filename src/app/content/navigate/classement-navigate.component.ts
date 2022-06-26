import { Component } from '@angular/core';

import { UserService } from 'src/app/services/user.service';


@Component({
    selector: 'classement-navigate',
    templateUrl: './classement-navigate.component.html',
    styleUrls: ['./classement-navigate.component.scss'],
})
export class ClassementNavigateComponent {
    searchKey = '';

    constructor(private userSerice: UserService) {}

    submit() {
        //this.userSerice.getClassementByName(this.searchKey).then(() => {
        //  }
    }
}
