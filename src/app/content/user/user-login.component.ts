import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

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

    constructor(private router: Router, private userService: APIUserService) {
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
