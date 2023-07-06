import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Category, Classement, SortClassementCol, SortDirection } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

@Component({
    selector: 'admin-classements',
    templateUrl: './admin-classements.component.html',
    styleUrls: ['./admin-classements.component.scss'],
})
export class AdminClassementsComponent implements OnDestroy {
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

    constructor(
        private readonly classementService: APIClassementService,
        private readonly route: ActivatedRoute,
        private readonly categories: CategoriesService,
    ) {
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
        );

        this.categoryUpdate();
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
                        if (classement.rankingId === c.rankingId) {
                            this.classements[page][index] = classement;
                        }
                    });
                }
            }
        }
    }

    private categoryUpdate() {
        this.categoriesList = this.categories.categoriesList;
    }
}
