import { Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { APIUserService } from 'src/app/services/api.user.service';
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
        private readonly title: Title,
    ) {
        this.title.setTitle(`${this.translate.instant('menu.login')} - ${this.translate.instant('classement')}`);

        this.listener.push(
            this.userService.afterLoggin.subscribe(() => {
                if (this.userService.logged) {
                    this.router.navigate(['/user/profile']);
                }
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

    ngOnDestroy(): void {
        this.listener.clear();
        this.loader = false;
    }
}
