import { Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { APIUserService } from 'src/app/services/api.user.service';
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

    private listener = Subscriptions.instance();

    constructor(
        private readonly router: Router,
        private readonly userService: APIUserService,
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
    }

    ngOnDestroy(): void {
        this.listener.clear();
    }

    submit() {
        this.loader = true;
        this.userService
            .login(this.username, this.password)
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

    oauth(service: string) {
        window.location.href = `${environment.api.path}connect/${service}`;
    }
}
