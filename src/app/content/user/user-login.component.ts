import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { APIUserService } from 'src/app/services/api.user.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'user-login',
    templateUrl: './user-login.component.html',
    styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnDestroy {
    username = '';
    password = '';
    showError = '';

    loader = false;

    @Input() popup = false;

    private listener = Subscriptions.instance();

    constructor(
        private readonly router: Router,
        private readonly userService: APIUserService,
        private readonly translate: TranslateService,
        private readonly global: GlobalService,
    ) {
        this.updateTitle();

        this.listener.push(
            this.userService.afterLogin.subscribe(() => {
                if (!this.popup && this.userService.logged) {
                    this.router.navigate(['/user/profile']);
                }
            }),
            this.translate.onLangChange.subscribe(() => {
                this.updateTitle();
            }),
        );
    }

    updateTitle() {
        this.global.setTitle('menu.login');
    }

    ngOnDestroy(): void {
        this.listener.clear();
    }

    submit() {
        this.loader = true;
        this.userService
            .login(this.username, this.password)
            .then(() => {
                if (!this.popup) {
                    this.router.navigate(['/user/profile']);
                }
            })
            .catch(e => {
                this.showError = e;
            })
            .finally(() => {
                this.loader = false;
            });
    }

    oauth(service: string) {
        window.location.href = `${environment.api.path}connect/${service}`;
    }
}
