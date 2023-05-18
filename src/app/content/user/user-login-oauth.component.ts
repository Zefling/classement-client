import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

    constructor(private router: Router, private userService: APIUserService, private activatedRoute: ActivatedRoute) {
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
