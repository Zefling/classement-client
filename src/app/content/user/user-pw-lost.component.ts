import { Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { APIUserService } from 'src/app/services/api.user.service';
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
        private readonly translate: TranslateService,
        private readonly title: Title,
    ) {
        this.title.setTitle(
            `${this.translate.instant('menu.forgot.password')} - ${this.translate.instant('classement')}`,
        );

        this.listener.push(
            this.userService.afterLoggin.subscribe(() => {
                if (this.userService.logged) {
                    this.router.navigate(['/user/profile']);
                }
            }),
        );
    }

    ngOnDestroy(): void {
        this.listener.clear();
    }

    submit() {
        this.showError = '';
        if (this.email.trim() === '') {
            this.showError = this.translate.instant('error.api-code.1020');
        } else if (!Utils.testEmail(this.email)) {
            this.showError = this.translate.instant('error.email.invalid');
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
