import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject } from '@angular/core';
import { Params, Router, RouterLink } from '@angular/router';

import { MagmaLoaderBlock, MagmaLoaderTile, MagmaMessages, Subscriptions } from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { environment } from '../../../environments/environment';
import { NavigateResultComponent } from '../../components/navigate-result/navigate-result.component';
import { SearchBarComponent, SearchFormFields } from '../../components/search-bar/search-bar.component';
import { Classement, PreferencesData } from '../../interface/interface';
import { APIClassementService } from '../../services/api.classement.service';
import { APIUserService } from '../../services/api.user.service';
import { GlobalService } from '../../services/global.service';
import { PreferencesService } from '../../services/preferences.service';

@Component({
    selector: 'classement-home',
    templateUrl: './classement-home.component.html',
    styleUrls: ['./classement-home.component.scss'],

    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgTemplateOutlet,
        RouterLink,
        NavigateResultComponent,
        SearchBarComponent,
        TranslocoPipe,
        MagmaLoaderBlock,
        MagmaLoaderTile,
    ],
})
export class ClassementHomeComponent {
    private readonly userService = inject(APIUserService);
    private readonly classementService = inject(APIClassementService);
    private readonly mgMessage = inject(MagmaMessages);
    private readonly translate = inject(TranslocoService);
    private readonly global = inject(GlobalService);
    private readonly preferencesService = inject(PreferencesService);
    private readonly cd = inject(ChangeDetectorRef);
    private readonly router = inject(Router);

    version = environment.version;

    modeApi = computed(() => this.global.withApi());

    logged = false;

    loading = false;

    classements: Classement[] = [];

    readonly preferences: PreferencesData;

    private listener = Subscriptions.instance();

    constructor() {
        this.updateTitle();

        this.preferences = this.preferencesService.preferences;

        if (this.modeApi()) {
            this.logged = !!this.userService.logged;
            this.loading = true;
            this.classementService
                .getClassementsLast()
                .then(classements => {
                    this.classements = classements;
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

        this.listener.push(
            this.translate.langChanges$.subscribe(() => {
                this.updateTitle();
            }),
        );
    }

    openNew() {
        this.global.onOpenChoice.next();
    }

    updateTitle() {
        this.global.setTitle('menu.home');
    }

    ngOnDestroy(): void {
        this.listener.clear();
    }

    search(fields: SearchFormFields) {
        const queryParams: Params = {};
        if (fields.searchKey) {
            queryParams['name'] = fields.searchKey;
        }
        if (fields.category) {
            queryParams['category'] = fields.category;
        }
        if (fields.mode) {
            queryParams['mode'] = fields.mode;
        }

        this.router.navigate(['/navigate'], { queryParams });
    }
}
