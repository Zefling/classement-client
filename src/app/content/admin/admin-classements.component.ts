import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Classement, SortClassementCol, SortDirection } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

@Component({
    selector: 'admin-classements',
    templateUrl: './admin-classements.component.html',
    styleUrls: ['./admin-classements.component.scss'],
})
export class AdminClassementsComponent implements OnDestroy {
    private _sub = Subscriptions.instance();

    classements: { [key: number]: Classement[] } = {};
    total?: number = 0;
    page = 0;

    sort: SortClassementCol = 'dateCreate';
    direction: SortDirection = 'DESC';

    constructor(private readonly classementService: APIClassementService, private readonly route: ActivatedRoute) {
        this._sub.push(
            this.route.queryParams.subscribe(params => {
                this.sort = params['sort'] || 'dateCreate';
                this.direction = params['direction'] || 'DESC';
                const page = params['page'] || 1;
                this.pageUpdate(page);
            }),
        );
    }

    ngOnDestroy() {
        this._sub.clear();
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
            this.classementService.adminGetClassements(page, this.sort, this.direction).then(result => {
                this.total = result.total;
                this.page = page;
                this.classements[page] = result.list;
            });
        } else {
            this.page = page;
        }
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
}
