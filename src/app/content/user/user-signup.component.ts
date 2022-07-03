import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import owasp from 'owasp-password-strength-test';
import { Subscription } from 'rxjs';

import { UserService } from 'src/app/services/user.service';


@Component({
    selector: 'user-signup',
    templateUrl: './user-signup.component.html',
    styleUrls: ['./user-signup.component.scss'],
})
export class UserSignupComponent implements OnDestroy {
    username = '';
    password = '';
    password2 = '';
    email = '';
    showError: string[] = [];

    listener: Subscription[] = [];

    constructor(private router: Router, private userService: UserService, private translate: TranslateService) {
        this.listener.push(
            this.userService.afterLoggin.subscribe(() => {
                if (this.userService.logged) {
                    this.router.navigate(['/user/profile']);
                }
            }),
        );

        owasp.config({
            allowPassphrases: true,
            minLength: 8,
            minPhraseLength: 20,
            minOptionalTestsToPass: 4,
        });
    }

    ngOnDestroy(): void {
        this.listener.forEach(e => e.unsubscribe());
    }

    submit() {
        const test = owasp.test(this.password);

        this.showError = [];

        if (this.password !== this.password2) {
            this.showError.push(this.translate.instant('error.pw.duplicate'));
        }
        if (test.errors?.length) {
            test.errors.forEach(e =>
                this.showError.push(
                    this.translate.instant('error.owasp.' + e.replace(/\d+/, '*')).replace('%', e.match(/\d+/)?.[0]),
                ),
            );
        }

        if (!this.showError.length) {
            // this.userService
            //     .login(this.username, this.password)
            //     .then(() => {
            //         this.router.navigate(['/user/profile']);
            //     })
            //     .catch(e => {
            //         this.showError = e;
            //     });
        }
    }
}
