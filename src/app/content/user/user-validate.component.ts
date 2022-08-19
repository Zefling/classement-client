import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { APIUserService } from 'src/app/services/api.user.service';


@Component({
    selector: 'user-validate',
    templateUrl: './user-validate.component.html',
    styleUrls: ['./user-validate.component.scss'],
})
export class UserValidateComponent {
    error = '';

    constructor(
        private userService: APIUserService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private translate: TranslateService,
    ) {
        this.activatedRoute.paramMap.subscribe(params => {
            const token = params.get('token');
            if (token) {
                this.userService
                    .userValidate(token)
                    .then(() => {
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
