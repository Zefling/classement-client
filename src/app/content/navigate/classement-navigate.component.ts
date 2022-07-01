import { Component } from '@angular/core';

import { Classement } from 'src/app/interface';
import { UserService } from 'src/app/services/user.service';

import { categories } from '../classement/classement-default';


@Component({
    selector: 'classement-navigate',
    templateUrl: './classement-navigate.component.html',
    styleUrls: ['./classement-navigate.component.scss'],
})
export class ClassementNavigateComponent {
    categories = categories;

    searchKey = '';
    category = '';

    classements: Classement[] = [];

    isCatagoryList = false;

    constructor(private userSerice: UserService) {
        this.showChatList();
    }

    showChatList() {
        this.isCatagoryList = true;
        this.userSerice.getClassementsHome().then(classements => {
            this.classements = classements;
        });
    }

    submit() {
        this.userSerice.getClassementsByOptions({ name: this.searchKey, category: this.category }).then(classements => {
            this.classements = classements;
            this.isCatagoryList = false;
        });
    }

    openCategory(classement: Classement) {
        this.userSerice.getClassementsByOptions({ category: classement.category }).then(classements => {
            this.classements = classements;
            this.category = classement.category;
            this.isCatagoryList = false;
        });
    }

    openClassement(classement: Classement) {}
}
