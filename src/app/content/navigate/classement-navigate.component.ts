import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Classement } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';

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

    constructor(private classementService: APIClassementService, private router: Router) {
        this.showChatList();
    }

    showChatList() {
        this.isCatagoryList = true;
        this.classementService.getClassementsHome().then(classements => {
            this.classements = classements;
        });
    }

    submit() {
        this.classementService
            .getClassementsByOptions({ name: this.searchKey, category: this.category })
            .then(classements => {
                this.classements = classements;
                this.isCatagoryList = false;
            });
    }

    openCategory(classement: Classement) {
        this.classementService.getClassementsByOptions({ category: classement.category }).then(classements => {
            this.classements = classements;
            this.category = classement.category;
            this.isCatagoryList = false;
        });
    }

    openClassement(classement: Classement) {
        this.router.navigate(['edit', classement.rankingId]);
    }
}
