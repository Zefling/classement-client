import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Logger, LoggerLevel, MagmaLoaderBlock, MagmaLoaderTile, MagmaMessages, MagmaPagination } from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { SearchBarComponent, SearchFormFields } from 'src/app/components/search-bar/search-bar.component';
import { Classement } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { GlobalService } from 'src/app/services/global.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

import { NavigateResultComponent } from '../../components/navigate-result/navigate-result.component';

@Component({
    selector: 'classement-navigate',
    templateUrl: './classement-navigate.component.html',
    styleUrls: ['./classement-navigate.component.scss'],

    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        RouterLink,
        NavigateResultComponent,
        TranslocoPipe,
        MagmaLoaderBlock,
        MagmaLoaderTile,
        MagmaPagination,
        SearchBarComponent,
    ],
})
export class ClassementNavigateComponent implements OnDestroy {
    private readonly classementService = inject(APIClassementService);
    private readonly global = inject(GlobalService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly logger = inject(Logger);
    private readonly mgMessage = inject(MagmaMessages);
    private readonly preferences = inject(PreferencesService);
    private readonly translate = inject(TranslocoService);
    private readonly cd = inject(ChangeDetectorRef);

    fields: SearchFormFields = { searchKey: '', category: '', mode: '' };
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

    private _sub = Subscriptions.instance();

    constructor() {
        this.updateTitle();

        this._sub.push(
            this.route.queryParams.subscribe(params => {
                this.logger.log('params', LoggerLevel.log, params);
                this.fields.searchKey = params['name'];
                this.fields.category = params['category'];
                this.fields.mode = params['mode'];
                this.all = params['all'];
                this.tag = params['tag'];
                this.page = params['page'];
                this.queryParams = {
                    name: this.fields.searchKey,
                    category: this.fields.category,
                    mode: this.fields.mode,
                    tag: this.tag,
                    all: this.all,
                };

                if (this.fields.searchKey || this.fields.category || this.fields.mode || this.page || this.tag) {
                    this.submit();
                } else {
                    this.showCategoriesList();
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
                this.cd.markForCheck();
            });
    }

    search(fields: SearchFormFields) {
        this.fields = fields;
        this.submit(true);
    }

    submit(reset: boolean = false) {
        if (reset) {
            this.page = 1;
            this.global.onPageUpdate.next(1);
        }

        this.loading = true;
        this.classementService
            .getClassementsByCriterion({
                name: this.fields.searchKey,
                category: this.fields.category,
                all: this.all,
                tag: this.tag,
                mode: this.fields.mode,
                page: this.page,
                size: this.pageSize,
            })
            .then(classements => {
                this.classements = classements.list;
                this.total = classements.total;
                this.fields = this.fields;
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
                    this.fields.searchKey === undefined &&
                        this.fields.category === undefined &&
                        this.fields.mode === undefined &&
                        this.page === undefined &&
                        this.tag === undefined
                        ? {}
                        : {
                              queryParams: {
                                  name: this.fields.searchKey,
                                  category: this.fields.category,
                                  mode: this.fields.mode,
                                  page: this.page,
                                  tag: this.tag,
                                  all: this.all,
                              },
                          },
                );
                this.loading = false;
                this.cd.markForCheck();
            });
    }
}
