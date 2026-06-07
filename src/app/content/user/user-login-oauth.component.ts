import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MagmaBlockMessage, MagmaLoader, MagmaMessage, MagmaSpinner, Subscriptions } from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { APIUserService } from '../../services/api.user.service';
import { GlobalService } from '../../services/global.service';

@Component({
    selector: 'user-login-oauth',
    templateUrl: './user-login-oauth.component.html',
    styleUrls: ['./user-login-oauth.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, TranslocoPipe, MagmaLoader, MagmaSpinner, MagmaMessage, MagmaBlockMessage],
})
export class UserLoginOauthComponent implements OnDestroy {
    private readonly router = inject(Router);
    private readonly userService = inject(APIUserService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslocoService);
    private readonly global = inject(GlobalService);

    showError = '';

    loader = true;

    private listener = Subscriptions.instance();

    constructor() {
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
