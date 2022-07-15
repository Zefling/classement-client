import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Classement } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { NavigateService } from 'src/app/services/navigate.service';

import { categories } from '../classement/classement-default';


@Component({
    selector: 'classement-navigate',
    templateUrl: './classement-navigate.component.html',
    styleUrls: ['./classement-navigate.component.scss'],
})
export class ClassementNavigateComponent implements OnDestroy {
    categories = categories;

    searchKey = '';
    category = '';

    classements: Classement[] = [];

    isCatagoryList = false;

    private _sub: Subscription[] = [];

    constructor(
        private classementService: APIClassementService,
        private router: Router,
        private route: ActivatedRoute,
        private navigate: NavigateService,
    ) {
        this._sub.push(
            this.route.queryParams.subscribe(params => {
                console.log('params', params);
                this.searchKey = params['name'] || '';
                this.category = params['category'] || '';
                if (this.searchKey || this.category) {
                    this.submit();
                } else if (this.navigate.category || this.navigate.searchKey) {
                    this.searchKey = this.navigate.searchKey || '';
                    this.category = this.navigate.category || '';
                    this.submit();
                } else {
                    this.showChatList();
                }
            }),
        );
    }

    ngOnDestroy() {
        this._sub.forEach(e => e.unsubscribe());
    }

    showChatList() {
        this.isCatagoryList = true;
        this.classementService.getClassementsHome().then(classements => {
            this.classements = classements;
            this.navigate.category = '';
            this.navigate.searchKey = '';
            this.router.navigate(['navigate']);
        });
    }

    submit() {
        this.classementService
            .getClassementsByOptions({ name: this.searchKey, category: this.category })
            .then(classements => {
                this.classements = classements;
                this.category = this.category;
                this.searchKey = this.searchKey;
                this.isCatagoryList = false;
            })
            .catch(() => {
                this.classements = [];
            })
            .finally(() => {
                this.router.navigate(['navigate'], { queryParams: { name: this.searchKey, category: this.category } });
                this.navigate.category = this.category;
                this.navigate.searchKey = this.searchKey;
            });
    }

    openCategory(classement: Classement) {
        this.classementService.getClassementsByOptions({ category: classement.category }).then(classements => {
            this.classements = classements;
            this.category = classement.category;
            this.isCatagoryList = false;
            this.router.navigate(['navigate'], { queryParams: { category: classement.category } });
            this.navigate.category = this.category;
            this.navigate.searchKey = '';
        });
    }

    openClassement(classement: Classement) {
        this.router.navigate(['edit', classement.rankingId]);
    }

    seeTemplate(classement: Classement) {
        this.router.navigate(['navigate', 'template', classement.templateId]);
    }
}
