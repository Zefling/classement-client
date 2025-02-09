import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { FormBuilderExtended, MagmaInput, MagmaInputElement, MagmaInputText } from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { APIUserService } from 'src/app/services/api.user.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';

@Component({
    selector: 'user-pw-lost',
    templateUrl: './user-pw-lost.component.html',
    styleUrls: ['./user-pw-lost.component.scss'],
    imports: [RouterLink, TranslocoPipe, ReactiveFormsModule, MagmaInput, MagmaInputElement, MagmaInputText],
})
export class UserPwLostComponent implements OnDestroy {
    private readonly router = inject(Router);
    private readonly userService = inject(APIUserService);
    private readonly translate = inject(TranslocoService);
    private readonly global = inject(GlobalService);
    private readonly fbe = inject(FormBuilderExtended);

    email = '';
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
}
