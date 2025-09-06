import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MagmaLoaderBlock, MagmaLoaderTile, MagmaMessages } from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { Classement, PreferencesData } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { GlobalService } from 'src/app/services/global.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { environment } from 'src/environments/environment';

import { NavigateResultComponent } from '../../components/navigate-result/navigate-result.component';
import { AdminRoutingModule } from '../admin/admin.routing';

@Component({
    selector: 'classement-home',
    templateUrl: './classement-home.component.html',
    styleUrls: ['./classement-home.component.scss'],
    imports: [
        NgTemplateOutlet,
        RouterLink,
        NavigateResultComponent,
        TranslocoPipe,
        MagmaLoaderBlock,
        MagmaLoaderTile,
        AdminRoutingModule,
    ],
})
export class ClassementHomeComponent {
    private readonly userService = inject(APIUserService);
    private readonly classementService = inject(APIClassementService);
    private readonly mgMessage = inject(MagmaMessages);
    private readonly translate = inject(TranslocoService);
    private readonly global = inject(GlobalService);
    private readonly preferencesService = inject(PreferencesService);

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
}
