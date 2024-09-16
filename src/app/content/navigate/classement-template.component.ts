import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { Classement } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

import { LoaderItemComponent } from '../../components/loader/loader-item.component';
import { NavigateResultComponent } from '../../components/navigate-result/navigate-result.component';
import { categories } from '../classement/classement-default';

@Component({
    selector: 'classement-template',
    templateUrl: './classement-template.component.html',
    styleUrls: ['./classement-template.component.scss'],
    standalone: true,
    imports: [RouterLink, NavigateResultComponent, LoaderItemComponent, TranslocoPipe],
})
export class ClassementTemplateComponent {
    private readonly classementService = inject(APIClassementService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly translate = inject(TranslocoService);
    private readonly global = inject(GlobalService);

    categories = categories;

    classements: Classement[] = [];

    isCategoryList = false;

    loading = false;

    private _sub = Subscriptions.instance();

    constructor() {
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
            this.translate.langChanges$.subscribe(() => {
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
