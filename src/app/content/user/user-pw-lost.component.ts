import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { TranslocoService } from '@jsverse/transloco';

import { APIUserService } from 'src/app/services/api.user.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';

@Component({
    selector: 'user-pw-lost',
    templateUrl: './user-pw-lost.component.html',
    styleUrls: ['./user-pw-lost.component.scss'],
})
export class UserPwLostComponent implements OnDestroy {
    email = '';
    showError = '';
    valide = false;

    listener = Subscriptions.instance();

    constructor(
        private readonly router: Router,
        private readonly userService: APIUserService,
        private readonly translate: TranslocoService,
        private readonly global: GlobalService,
    ) {
        this.updateTitle();

        this.listener.push(
            this.userService.afterLogin.subscribe(() => {
                if (this.userService.logged) {
                    this.router.navigate(['/user/profile']);
                }
            }),
            this.translate.langChanges$.subscribe(() => {
                this.updateTitle();
            }),
        );
    }

    updateTitle() {
        this.global.setTitle('menu.forgot.password');
    }

    ngOnDestroy(): void {
        this.listener.clear();
    }

    submit() {
        this.showError = '';
        if (this.email.trim() === '') {
            this.showError = this.translate.translate('error.api-code.1020');
        } else if (!Utils.testEmail(this.email)) {
            this.showError = this.translate.translate('error.email.invalid');
        }

        if (!this.showError.length) {
            this.userService
                .passwordLost(this.email)
                .then(() => {
                    this.valide = true;
                })
                .catch(e => {
                    this.showError = e;
                });
        }
    }
}
