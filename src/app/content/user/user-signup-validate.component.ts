import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MagmaMessages } from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { APIUserService } from 'src/app/services/api.user.service';

@Component({
    selector: 'user-signup-validate',
    templateUrl: './user-signup-validate.component.html',
    styleUrls: ['./user-signup-validate.component.scss'],
    imports: [TranslocoPipe],
})
export class UserSignupValidateComponent {
    private readonly userService = inject(APIUserService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly translate = inject(TranslocoService);
    private readonly mgMessage = inject(MagmaMessages);

    error = '';

    constructor() {
        this.activatedRoute.paramMap.subscribe(params => {
            const token = params.get('token');
            if (token) {
                this.userService
                    .userValidate(token)
                    .then(() => {
                        this.mgMessage.addMessage(this.translate.translate('message.user.validate.success'), {
                            time: '7s',
                        });
                        this.router.navigate(['/user/login']);
                    })
                    .catch(() => {
                        this.error = this.translate.translate('error.token.invalid');
                    });
            } else {
                this.error = this.translate.translate('error.token.not');
            }
        });
    }
}
