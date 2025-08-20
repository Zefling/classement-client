import { NgClass } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
    Logger,
    LoggerLevel,
    MagmaInput,
    MagmaInputElement,
    MagmaInputSelect,
    MagmaInputText,
    MagmaLoaderBlock,
    MagmaLoaderTile,
    MagmaMessages,
    MagmaPagination,
} from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { Select2Data } from 'ng-select2-component';

import { Classement } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { GlobalService } from 'src/app/services/global.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

import { NavigateResultComponent } from '../../components/navigate-result/navigate-result.component';
import { listModes } from '../classement/classement-default';

@Component({
    selector: 'classement-navigate',
    templateUrl: './classement-navigate.component.html',
    styleUrls: ['./classement-navigate.component.scss'],
    imports: [
        FormsModule,
        NgClass,
        RouterLink,
        NavigateResultComponent,
        TranslocoPipe,
        MagmaLoaderBlock,
        MagmaLoaderTile,
        MagmaInput,
        MagmaInputText,
        MagmaInputElement,
        MagmaInputSelect,
        MagmaPagination,
    ],
})
export class ClassementNavigateComponent implements OnDestroy {
    private readonly classementService = inject(APIClassementService);
    private readonly global = inject(GlobalService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly logger = inject(Logger);
    private readonly mgMessage = inject(MagmaMessages);
    private readonly categories = inject(CategoriesService);
    private readonly preferences = inject(PreferencesService);
    private readonly translate = inject(TranslocoService);

    categoriesList?: Select2Data;
    categoriesType?: Select2Data;

    searchKey: string = '';
    category: string = '';
    mode: string = '';
    tag: string = '';
    all: boolean = false;

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

    constructor() {
        this.updateTitle();

        this._sub.push(
            this.route.queryParams.subscribe(params => {
                this.logger.log('params', LoggerLevel.log, params);
                this.searchKey = params['name'];
                this.category = params['category'];
                this.mode = params['mode'];
                this.all = params['all'];
                this.tag = params['tag'];
                this.page = params['page'];
                this.queryParams = {
                    name: this.searchKey,
                    category: this.category,
                    mode: this.mode,
                    tag: this.tag,
                    all: this.all,
                };

                if (this.searchKey || this.category || this.mode || this.page || this.tag) {
                    this.submit();
                } else {
                    this.showCategoriesList();
                }
            }),
            this.categories.onChange.subscribe(() => {
                this.categoryUpdate();
            }),
            this.translate.langChanges$.subscribe(() => {
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
                this.mgMessage.addMessage(this.translate.translate('message.navigate.access.error'));
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
                all: this.all,
                tag: this.tag,
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
                this.all = this.all;
                this.tag = this.tag;
            })
            .catch(() => {
                this.classements = [];
                this.total = 0;
            })
            .finally(() => {
                this.router.navigate(
                    ['navigate'],
                    this.searchKey === undefined &&
                        this.category === undefined &&
                        this.mode === undefined &&
                        this.page === undefined &&
                        this.tag === undefined
                        ? {}
                        : {
                              queryParams: {
                                  name: this.searchKey,
                                  category: this.category,
                                  mode: this.mode,
                                  page: this.page,
                                  tag: this.tag,
                                  all: this.all,
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
