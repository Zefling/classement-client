import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { MessageService } from 'src/app/components/info-messages/info-messages.component';
import { Category, Classement } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { GlobalService } from 'src/app/services/global.service';
import { Logger, LoggerLevel } from 'src/app/services/logger';
import { Subscriptions } from 'src/app/tools/subscriptions';

@Component({
    selector: 'classement-navigate',
    templateUrl: './classement-navigate.component.html',
    styleUrls: ['./classement-navigate.component.scss'],
})
export class ClassementNavigateComponent implements OnDestroy {
    categoriesList?: Category[];

    searchKey?: string;
    category?: string;

    classements: Classement[] = [];

    loading = false;

    total = 0;
    page = 0;
    url = '/navigate';
    queryParams = {};

    isCatagoryList = false;

    private _sub = Subscriptions.instance();

    constructor(
        private readonly classementService: APIClassementService,
        private readonly globalService: GlobalService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly logger: Logger,
        private readonly messageService: MessageService,
        private readonly translate: TranslateService,
        private readonly categories: CategoriesService,
    ) {
        this._sub.push(
            this.route.queryParams.subscribe(params => {
                this.logger.log('params', LoggerLevel.log, params);
                this.searchKey = params['name'];
                this.category = params['category'];
                this.page = params['page'];
                this.queryParams = { name: this.searchKey, category: this.category };
                if (this.searchKey !== undefined || this.category !== undefined || params['page']) {
                    this.submit();
                } else {
                    this.showCategoriesList();
                }
            }),
            this.categories.onChange.subscribe(() => {
                this.categoryUpdate();
            }),
        );

        this.categoryUpdate();
    }

    ngOnDestroy() {
        this._sub.clear();
    }

    showCategoriesList() {
        this.isCatagoryList = true;
        this.loading = true;
        this.classementService
            .getClassementsHome()
            .then(classements => {
                this.classements = classements;
                this.total = this.classements.length;
            })
            .catch(() => {
                this.classements = [];
                this.messageService.addMessage(this.translate.instant('message.navigate.access.error'));
            })
            .finally(() => {
                this.loading = false;
            });
    }

    submit(reset: boolean = false) {
        if (reset) {
            this.page = 1;
            this.globalService.onPageUpdate.next(1);
        }
        this.loading = true;
        this.classementService
            .getClassementsByCriterion({ name: this.searchKey, category: this.category, page: this.page })
            .then(classements => {
                this.classements = classements.list;
                this.total = classements.total;
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
                    this.searchKey === undefined && this.category === undefined && this.page === undefined
                        ? {}
                        : {
                              queryParams: {
                                  name: this.searchKey,
                                  category: this.category,
                                  page: this.page,
                              },
                          },
                );

                this.loading = false;
            });
    }

    private categoryUpdate() {
        this.categoriesList = this.categories.categoriesList;
    }
}
