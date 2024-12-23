import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { Select2Module } from 'ng-select2-component';

import { Category, Classement, SortClassementCol, SortDirection } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

import { ListClassementsComponent } from './list-classements.component';

import { LoadingComponent } from '../../components/loader/loading.component';
import { PaginationComponent } from '../../components/paginate/paginate.component';

@Component({
    selector: 'admin-classements',
    templateUrl: './admin-classements.component.html',
    styleUrls: ['./admin-classements.component.scss'],
    imports: [
        FormsModule,
        Select2Module,
        LoadingComponent,
        PaginationComponent,
        ListClassementsComponent,
        TranslocoPipe,
    ],
})
export class AdminClassementsComponent implements OnDestroy {
    private readonly classementService = inject(APIClassementService);
    private readonly route = inject(ActivatedRoute);
    private readonly categories = inject(CategoriesService);
    private readonly translate = inject(TranslocoService);
    private readonly global = inject(GlobalService);

    private _sub = Subscriptions.instance();

    categoriesList?: Category[];

    loading = false;

    searchKey?: string;
    category?: string;

    classements: Record<number, Classement[]> = {};
    total?: number = 0;
    page = 0;

    sort: SortClassementCol = 'dateCreate';
    direction: SortDirection = 'DESC';

    constructor() {
        this.updateTitle();

        this._sub.push(
            this.route.queryParams.subscribe(params => {
                this.sort ||= params['sort'] || 'dateCreate';
                this.direction ||= params['direction'] || 'DESC';
                const page = params['page'] || 1;
                this.pageUpdate(page);
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
        this.global.setTitle('menu.admin.classements', true);
    }

    ngOnDestroy() {
        this._sub.clear();
    }

    resteFilter(filterInput: HTMLInputElement) {
        this.searchKey = '';
        setTimeout(() => {
            filterInput.dispatchEvent(new InputEvent('input'));
            filterInput.focus();
        });
    }

    sortUpdate(sort: SortClassementCol) {
        this.classements = {};
        if (this.sort === sort) {
            this.direction = this.direction === 'DESC' ? 'ASC' : 'DESC';
        } else {
            this.sort = sort;
            this.direction = 'DESC';
        }
        this.pageUpdate(1);
    }

    pageUpdate(page: number) {
        if (!this.classements[page]) {
            this.loading = true;
            this.classementService
                .adminGetClassements(page, this.sort, this.direction, this.searchKey, this.category)
                .then(result => {
                    this.total = result.total;
                    this.page = page;
                    this.classements[page] = result.list;
                })
                .finally(() => {
                    this.loading = false;
                });
        } else {
            this.page = page;
        }
    }

    submit() {
        this.classements = {};
        this.sort = 'dateCreate';
        this.direction = 'DESC';
        this.pageUpdate(1);
    }

    updateClassements(classements: Classement[]) {
        if (classements?.length) {
            for (let classement of classements) {
                for (let page in this.classements) {
                    this.classements[page]?.forEach((c, index) => {
                        if (classement.rankingId === c.rankingId && this.classements[page]) {
                            this.classements[page]![index] = classement;
                        }
                    });
                }
            }
        }
    }

    private categoryUpdate() {
        this.categoriesList = [{ value: '', label: '\u00a0' }, ...this.categories.categoriesList];
    }
}
