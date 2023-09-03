import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Classement } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { GlobalService } from 'src/app/services/global.service';
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
        private readonly global: GlobalService,
    ) {
        this.updateTitle();

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
            this.translate.onLangChange.subscribe(() => {
                this.updateTitle();
            }),
        );
    }

    updateTitle() {
        this.global.setTitle('menu.navigate');
    }

    ngOnDestroy() {
        this._sub.clear();
    }
}
