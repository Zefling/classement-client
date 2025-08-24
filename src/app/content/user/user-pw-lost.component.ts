import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
    FormBuilderExtended,
    MagmaBlockMessage,
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
    MagmaMessage,
    testEmail,
} from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { APIUserService } from 'src/app/services/api.user.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

@Component({
    selector: 'user-pw-lost',
    templateUrl: './user-pw-lost.component.html',
    styleUrls: ['./user-pw-lost.component.scss'],
    imports: [
        RouterLink,
        TranslocoPipe,
        ReactiveFormsModule,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaMessage,
        MagmaBlockMessage,
    ],
})
export class UserPwLostComponent implements OnDestroy {
    private readonly router = inject(Router);
    private readonly userService = inject(APIUserService);
    private readonly translate = inject(TranslocoService);
    private readonly global = inject(GlobalService);
    private readonly fbe = inject(FormBuilderExtended);

    showError = '';
    valide = false;

    listener = Subscriptions.instance();

    readonly form: FormGroup<{
        email: FormControl<string>;
    }>;

    constructor() {
        this.updateTitle();

        this.form = this.fbe.groupWithErrorNonNullable({
            email: {
                default: 'Test',
                control: {
                    required: { state: true, message: () => this.translate.translate('user.login.email.required') },
                    email: { message: () => this.translate.translate('user.login.email.email') },
                },
            },
        });

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

        this.fbe.validateForm(this.form);
        if (this.form.valid) {
            const email = this.form.value.email;
            if (!email || email?.trim() === '') {
                this.showError = this.translate.translate('error.api-code.1020');
            } else if (!testEmail(email)) {
                this.showError = this.translate.translate('error.email.invalid');
            }

            if (!this.showError.length) {
                this.userService
                    .passwordLost(email!)
                    .then(() => {
                        this.valide = true;
                    })
                    .catch(e => {
                        this.showError = e;
                    });
            }
        }
    }
}
