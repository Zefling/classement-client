import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Classement } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';

import { categories } from '../classement/classement-default';


@Component({
    selector: 'classement-template',
    templateUrl: './classement-template.component.html',
    styleUrls: ['./classement-template.component.scss'],
})
export class ClassementTemplateComponent {
    categories = categories;

    classements: Classement[] = [];

    isCatagoryList = false;

    private _sub: Subscription[] = [];

    constructor(
        private classementService: APIClassementService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this._sub.push(
            this.route.params.subscribe(params => {
                if (params['id']) {
                    this.classementService
                        .getClassementsByTemplateId(params['id'])
                        .then(classements => {
                            if (classements?.length) {
                                this.classements = classements;
                            } else {
                                this.router.navigate(['navigate']);
                            }
                        })
                        .catch(() => {
                            this.router.navigate(['navigate']);
                        });
                }
            }),
        );
    }

    ngOnDistroy() {
        this._sub.forEach(e => e.unsubscribe());
    }

    openClassement(classement: Classement) {
        this.router.navigate(['edit', classement.rankingId]);
    }

    retrun() {
        this.router.navigate(['navigate']);
    }
}