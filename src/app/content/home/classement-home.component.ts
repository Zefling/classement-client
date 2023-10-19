import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { MessageService } from 'src/app/components/info-messages/info-messages.component';
import { Classement, PreferencesData } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { GlobalService } from 'src/app/services/global.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'classement-home',
    templateUrl: './classement-home.component.html',
    styleUrls: ['./classement-home.component.scss'],
})
export class ClassementHomeComponent {
    version = environment.version;

    modeApi = environment.api?.active || false;

    logged = false;

    loading = false;

    classements: Classement[] = [];

    readonly preferences: PreferencesData;

    private listener = Subscriptions.instance();

    constructor(
        private readonly userService: APIUserService,
        private readonly classementService: APIClassementService,
        private readonly messageService: MessageService,
        private readonly translate: TranslateService,
        private readonly global: GlobalService,
        private readonly preferencesService: PreferencesService,
    ) {
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
                    this.messageService.addMessage(this.translate.instant('message.navigate.access.error'));
                })
                .finally(() => {
                    this.loading = false;
                });
        }

        this.listener.push(
            this.translate.onLangChange.subscribe(() => {
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
