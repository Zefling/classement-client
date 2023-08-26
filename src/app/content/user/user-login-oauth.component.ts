import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { APIUserService } from 'src/app/services/api.user.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

@Component({
    selector: 'user-login-oauth',
    templateUrl: './user-login-oauth.component.html',
    styleUrls: ['./user-login-oauth.component.scss'],
})
export class UserLoginAouthComponent implements OnDestroy {
    showError = '';

    loader = true;

    private listener = Subscriptions.instance();

    constructor(
        private readonly router: Router,
        private readonly userService: APIUserService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly translate: TranslateService,
        private readonly global: GlobalService,
    ) {
        this.updateTitle();

        this.listener.push(
            this.userService.afterLoggin.subscribe(() => {
                if (this.userService.logged) {
                    this.router.navigate(['/user/profile']);
                }
            }),
            this.translate.onLangChange.subscribe(() => {
                this.updateTitle();
            }),
        );

        this.activatedRoute.paramMap.subscribe(params => {
            const token = params.get('token');
            const service = params.get('service');
            if (token && service) {
                this.userService
                    .loginOauth(token, service)
                    .then(() => {
                        this.router.navigate(['/user/profile']);
                    })
                    .catch(e => {
                        this.showError = e;
                    })
                    .finally(() => {
                        this.loader = false;
                    });
            }
        });
    }

    updateTitle() {
        this.global.setTitle('menu.login');
    }

    ngOnDestroy(): void {
        this.listener.clear();
        this.loader = false;
    }
}
