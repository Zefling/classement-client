import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Select2Data } from 'ng-select2-component';

import { MessageService } from 'src/app/components/info-messages/info-messages.component';
import { Classement } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { GlobalService } from 'src/app/services/global.service';
import { Logger, LoggerLevel } from 'src/app/services/logger';
import { PreferencesService } from 'src/app/services/preferences.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

import { listModes } from '../classement/classement-default';

@Component({
    selector: 'classement-navigate',
    templateUrl: './classement-navigate.component.html',
    styleUrls: ['./classement-navigate.component.scss'],
})
export class ClassementNavigateComponent implements OnDestroy {
    categoriesList?: Select2Data;
    categoriesType?: Select2Data;

    searchKey?: string;
    category?: string;
    mode?: string;

    classements: Classement[] = [];

    loading = false;

    total = 0;
    page = 0;
    url = '/navigate';
    queryParams = {};

    get pageSize(): number {
        return this.preferences.preferences.pageSize;
    }

    isCategoryList = false;

    listMode: Select2Data = [{ label: '', value: '' }, ...listModes];

    private _sub = Subscriptions.instance();

    constructor(
        private readonly classementService: APIClassementService,
        private readonly global: GlobalService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly logger: Logger,
        private readonly messageService: MessageService,
        private readonly categories: CategoriesService,
        private readonly preferences: PreferencesService,
        private readonly translate: TranslateService,
    ) {
        this.updateTitle();

        this._sub.push(
            this.route.queryParams.subscribe(params => {
                this.logger.log('params', LoggerLevel.log, params);
                this.searchKey = params['name'];
                this.category = params['category'];
                this.mode = params['mode'];
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
            this.translate.onLangChange.subscribe(() => {
                this.updateTitle();
            }),
        );

        this.categoryUpdate();
    }

    updateTitle() {
        this.global.setTitle('menu.navigate');
    }

    ngOnDestroy() {
        this._sub.clear();
    }

    showCategoriesList() {
        this.isCategoryList = true;
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
            this.global.onPageUpdate.next(1);
        }
        this.loading = true;
        this.classementService
            .getClassementsByCriterion({
                name: this.searchKey,
                category: this.category,
                mode: this.mode,
                page: this.page,
                size: this.pageSize,
            })
            .then(classements => {
                this.classements = classements.list;
                this.total = classements.total;
                this.category = this.category;
                this.mode = this.mode;
                this.searchKey = this.searchKey;
                this.isCategoryList = false;
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
                                  mode: this.mode,
                                  page: this.page,
                              },
                          },
                );

                this.loading = false;
            });
    }

    private categoryUpdate() {
        this.categoriesList = [{ value: '', label: '\u00a0' }, ...this.categories.categoriesList];
    }
}
