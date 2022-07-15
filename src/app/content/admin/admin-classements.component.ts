import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Classement } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';


@Component({
    selector: 'admin-classements',
    templateUrl: './admin-classements.component.html',
    styleUrls: ['./admin-classements.component.scss'],
})
export class AdminClassementsComponent implements OnDestroy {
    private _sub: Subscription[] = [];

    classements: { [key: number]: Classement[] } = {};
    total?: number = 0;
    page = 0;

    constructor(private classementService: APIClassementService, private route: ActivatedRoute) {
        this._sub.push(
            this.route.queryParams.subscribe(params => {
                console.log('params', params);
                this.classementService.getAdminClassements(params['page']).then(result => {
                    this.total = result.total;
                    this.page = params['page'] || 1;
                    this.classements[this.page] = result.list;
                });
            }),
        );
    }

    ngOnDestroy() {
        this._sub.forEach(e => e.unsubscribe());
    }

    see(classement: Classement) {}

    delete(classement: Classement) {}
}
