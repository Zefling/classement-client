import { Component, OnDestroy, OnInit, booleanAttribute, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { FormBuilderExtended, MagmaInput, MagmaInputElement, MagmaInputPassword, MagmaInputText } from '@ikilote/magma';
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
    imports: [
        RouterLink,
        LoaderComponent,
        TranslocoPipe,
        ReactiveFormsModule,
        MagmaInput,
        MagmaInputElement,
        MagmaInputPassword,
        MagmaInputText,
    ],
})
export class UserLoginComponent implements OnInit, OnDestroy {
    private readonly router = inject(Router);
    private readonly userService = inject(APIUserService);
    private readonly translate = inject(TranslocoService);
    private readonly global = inject(GlobalService);
    private readonly fbe = inject(FormBuilderExtended);

    showError = '';

    loader = false;

    popup = input<boolean, any>(false, { transform: booleanAttribute });

    private listener = Subscriptions.instance();

    readonly formLogin: FormGroup<{
        username: FormControl<string>;
        password: FormControl<string>;
    }>;

    constructor() {
        this.formLogin = this.fbe.groupWithErrorNonNullable({
            username: {
                default: '',
                control: {
                    required: { state: true, message: this.translate.translate('user.login.username.required') },
                },
            },
            password: {
                default: '',
                control: {
                    minlength: { state: 10, message: this.translate.translate('user.login.password.minlength') },
                    required: { state: true, message: this.translate.translate('user.login.password.required') },
                },
            },
        });
    }

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

    submit(event: MouseEvent) {
        this.loader = true;
        this.fbe.validateForm(this.formLogin);
        console.log(this.formLogin.valid, this.formLogin.value.username, this.formLogin.value.password);
        if (this.formLogin.valid && this.formLogin.value.username && this.formLogin.value.password) {
            debugger;
            this.userService
                .login(this.formLogin.value.username, this.formLogin.value.password)
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
        } else {
            this.loader = false;
        }
        event.stopPropagation();
        event.preventDefault();
    }

    oauth(service: string) {
        window.location.href = `${environment.api.path}connect/${service}`;
    }
}
