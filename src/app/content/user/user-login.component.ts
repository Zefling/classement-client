import { Component, OnDestroy, OnInit, booleanAttribute, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { APIUserService } from 'src/app/services/api.user.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { environment } from 'src/environments/environment';

import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
    selector: 'user-login',
    templateUrl: './user-login.component.html',
    styleUrls: ['./user-login.component.scss'],
    imports: [FormsModule, RouterLink, LoaderComponent, TranslocoPipe]
})
export class UserLoginComponent implements OnInit, OnDestroy {
    private readonly router = inject(Router);
    private readonly userService = inject(APIUserService);
    private readonly translate = inject(TranslocoService);
    private readonly global = inject(GlobalService);

    username = '';
    password = '';
    showError = '';

    loader = false;

    popup = input<boolean, any>(false, { transform: booleanAttribute });

    private listener = Subscriptions.instance();

    ngOnInit(): void {
        this.updateTitle();

        this.listener.push(
            this.userService.afterLogin.subscribe(() => {
                if (!this.popup() && this.userService.logged) {
                    this.router.navigate(['/user/profile']);
                }
            }),
            this.translate.langChanges$.subscribe(() => {
                this.updateTitle();
            }),
        );
    }

    updateTitle() {
        if (!this.popup()) {
            this.global.setTitle('menu.login');
        }
    }

    ngOnDestroy(): void {
        this.listener.clear();
    }

    submit() {
        this.loader = true;
        this.userService
            .login(this.username, this.password)
            .then(() => {
                if (!this.popup()) {
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
