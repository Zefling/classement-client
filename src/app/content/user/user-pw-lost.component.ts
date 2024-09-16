import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { APIUserService } from 'src/app/services/api.user.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';

@Component({
    selector: 'user-pw-lost',
    templateUrl: './user-pw-lost.component.html',
    styleUrls: ['./user-pw-lost.component.scss'],
    standalone: true,
    imports: [FormsModule, RouterLink, TranslocoPipe],
})
export class UserPwLostComponent implements OnDestroy {
    private readonly router = inject(Router);
    private readonly userService = inject(APIUserService);
    private readonly translate = inject(TranslocoService);
    private readonly global = inject(GlobalService);

    email = '';
    showError = '';
    valide = false;

    listener = Subscriptions.instance();

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
