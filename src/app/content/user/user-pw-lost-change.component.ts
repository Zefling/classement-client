import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { MessageService, MessageType } from 'src/app/components/info-messages/info-messages.component';
import { APIUserService } from 'src/app/services/api.user.service';

import { UserPassword } from './user-password';

@Component({
    selector: 'user-pw-lost-change',
    templateUrl: './user-pw-lost-change.component.html',
    styleUrls: ['./user-pw-lost-change.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, TranslocoPipe]
})
export class UserPwLostChangeComponent extends UserPassword {
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);

    valide = false;
    token?: string;

    constructor() {
        const userService = inject(APIUserService);
        const messageService = inject(MessageService);
        const translate = inject(TranslocoService);

        super(userService, messageService, translate);

        this.activatedRoute.paramMap.subscribe(params => {
            const token = params.get('token');
            if (token) {
                this.token = token;
            } else {
                this.showError = [this.translate.translate('error.token.not')];
            }
        });
    }

    override formGroupPasswordForm() {
        return {
            password: new FormControl(''),
            password2: new FormControl(''),
        };
    }

    override valideChangePassword() {
        var value = super.valideChangePassword();

        if (!this.showError.length) {
            this.userService
                .passwordChange(value.password, this.token!)
                .then(() => {
                    this.messageService.addMessage(this.translate.translate('message.server.update.password.success'));
                    this.router.navigate(['/user/login']);
                })
                .catch(e => {
                    this.messageService.addMessage(e, { type: MessageType.error });
                });
        }
    }
}
