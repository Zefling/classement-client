import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { MessageService } from 'src/app/components/info-messages/info-messages.component';
import { Classement } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'classement-home',
    templateUrl: './classement-home.component.html',
    styleUrls: ['./classement-home.component.scss'],
})
export class ClassementHomeComponent {
    version = '1.5.1';

    modeApi = environment.api?.active || false;

    logged = false;

    loading = false;

    classements: Classement[] = [];

    private listener: Subscription[] = [];

    constructor(
        private userService: APIUserService,
        private classementService: APIClassementService,
        private messageService: MessageService,
        private translate: TranslateService,
    ) {
        if (this.modeApi) {
            this.logged = !!this.userService.logged;

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
    }

    ngOnDestroy(): void {
        this.listener.forEach(e => e.unsubscribe());
    }
}
