import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { MessageService } from 'src/app/components/info-messages.component';
import { Classement } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { Logger, LoggerLevel } from 'src/app/services/logger';

import { categories } from '../classement/classement-default';


@Component({
    selector: 'classement-navigate',
    templateUrl: './classement-navigate.component.html',
    styleUrls: ['./classement-navigate.component.scss'],
})
export class ClassementNavigateComponent implements OnDestroy {
    categories = categories;

    searchKey?: string;
    category?: string;

    classements: Classement[] = [];

    loading = false;

    isCatagoryList = false;

    private _sub: Subscription[] = [];

    constructor(
        private classementService: APIClassementService,
        private router: Router,
        private route: ActivatedRoute,
        private logger: Logger,
        private messageService: MessageService,
        private translate: TranslateService,
    ) {
        this._sub.push(
            this.route.queryParams.subscribe(params => {
                this.logger.log('params', LoggerLevel.log, params);
                this.searchKey = params['name'];
                this.category = params['category'];
                if (this.searchKey !== undefined || this.category !== undefined) {
                    this.submit();
                } else {
                    this.showCategoriesList();
                }
            }),
        );
    }

    ngOnDestroy() {
        this._sub.forEach(e => e.unsubscribe());
    }

    showCategoriesList() {
        this.isCatagoryList = true;
        this.loading = true;
        this.classementService
            .getClassementsHome()
            .then(classements => {
                this.classements = classements;
            })
            .catch(() => {
                this.classements = [];
                this.messageService.addMessage(this.translate.instant('message.navigate.access.error'));
            })
            .finally(() => {
                this.router.navigate(['navigate']);
                this.loading = false;
            });
    }

    submit() {
        this.loading = true;
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
                this.messageService.addMessage(this.translate.instant('message.navigate.access.error'));
            })
            .finally(() => {
                this.router.navigate(
                    ['navigate'],
                    this.searchKey === undefined && this.category === undefined
                        ? {}
                        : {
                              queryParams: { name: this.searchKey, category: this.category },
                          },
                );

                this.loading = false;
            });
    }

    openCategory(classement: Classement) {
        this.classementService.getClassementsByOptions({ category: classement.category }).then(classements => {
            this.classements = classements;
            this.category = classement.category;
            this.isCatagoryList = false;
            this.router.navigate(['navigate'], { queryParams: { category: classement.category } });
        });
    }

    openClassement(classement: Classement) {
        this.router.navigate(['navigate', 'view', classement.rankingId]);
    }

    seeTemplate(classement: Classement) {
        this.router.navigate(['navigate', 'template', classement.templateId]);
    }
}
