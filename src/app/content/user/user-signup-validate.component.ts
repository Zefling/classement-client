import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { MessageService } from 'src/app/components/info-messages.component';
import { APIUserService } from 'src/app/services/api.user.service';


@Component({
    selector: 'user-signup-validate',
    templateUrl: './user-signup-validate.component.html',
    styleUrls: ['./user-signup-validate.component.scss'],
})
export class UserSignupValidateComponent {
    error = '';

    constructor(
        private userService: APIUserService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private translate: TranslateService,
        private messageService: MessageService,
    ) {
        this.activatedRoute.paramMap.subscribe(params => {
            const token = params.get('token');
            if (token) {
                this.userService
                    .userValidate(token)
                    .then(() => {
                        this.messageService.addMessage(this.translate.instant('message.user.validate.success'), {
                            time: '7s',
                        });
                        this.router.navigate(['/user/login']);
                    })
                    .catch(() => {
                        this.error = this.translate.instant('error.token.invalid');
                    });
            } else {
                this.error = this.translate.instant('error.token.not');
            }
        });
    }
}
