import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Classement } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

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

    loading = false;

    private _sub = Subscriptions.instance();

    constructor(
        private readonly classementService: APIClassementService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly translate: TranslateService,
        private readonly title: Title,
    ) {
        this.title.setTitle(`${this.translate.instant('menu.navigate')} - ${this.translate.instant('classement')}`);

        this._sub.push(
            this.route.params.subscribe(params => {
                if (params['id']) {
                    this.loading = true;
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
                        })
                        .finally(() => {
                            this.loading = false;
                        });
                }
            }),
        );
    }

    ngOnDestroy() {
        this._sub.clear();
    }
}
