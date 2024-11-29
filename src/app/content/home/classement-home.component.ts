import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { MessageService } from 'src/app/components/info-messages/info-messages.component';
import { Classement, PreferencesData } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { GlobalService } from 'src/app/services/global.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { environment } from 'src/environments/environment';

import { LoaderItemComponent } from '../../components/loader/loader-item.component';
import { NavigateResultComponent } from '../../components/navigate-result/navigate-result.component';

@Component({
    selector: 'classement-home',
    templateUrl: './classement-home.component.html',
    styleUrls: ['./classement-home.component.css'],
    imports: [RouterLink, NavigateResultComponent, LoaderItemComponent, TranslocoPipe],
})
export class ClassementHomeComponent {
    private readonly userService = inject(APIUserService);
    private readonly classementService = inject(APIClassementService);
    private readonly messageService = inject(MessageService);
    private readonly translate = inject(TranslocoService);
    private readonly global = inject(GlobalService);
    private readonly preferencesService = inject(PreferencesService);

    version = environment.version;

    modeApi = environment.api?.active || false;

    logged = false;

    loading = false;

    classements: Classement[] = [];

    readonly preferences: PreferencesData;

    private listener = Subscriptions.instance();

    constructor() {
        this.updateTitle();

        this.preferences = this.preferencesService.preferences;

        if (this.modeApi) {
            this.logged = !!this.userService.logged;
            this.loading = true;
            this.classementService
                .getClassementsLast()
                .then(classements => {
                    this.classements = classements;
                })
                .catch(() => {
                    this.classements = [];
                    this.messageService.addMessage(this.translate.translate('message.navigate.access.error'));
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
