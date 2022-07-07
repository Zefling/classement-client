import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import owasp from 'owasp-password-strength-test';
import { debounceTime, Subscription } from 'rxjs';

import { APIUserService } from 'src/app/services/api.user.service';


@Component({
    selector: 'user-signup',
    templateUrl: './user-signup.component.html',
    styleUrls: ['./user-signup.component.scss'],
})
export class UserSignupComponent implements OnDestroy {
    profileForm: FormGroup;
    usernameExist = false;
    emailExist = false;
    showError: string[] = [];
    passedTests: number[] = [];
    strong = false;
    confirm = false;

    listener: Subscription[] = [];

    constructor(private router: Router, private userService: APIUserService, private translate: TranslateService) {
        this.profileForm = new FormGroup({
            username: new FormControl(''),
            password: new FormControl(''),
            password2: new FormControl(''),
            email: new FormControl(''),
        });

        this.listener.push(
            this.userService.afterLoggin.subscribe(() => {
                if (this.userService.logged) {
                    this.router.navigate(['/user/profile']);
                }
            }),
        );

        this.profileForm
            .get('username')
            ?.valueChanges.pipe(debounceTime(500))
            .subscribe(value => {
                this.userService
                    .test('username', value)
                    .then(test => {
                        this.usernameExist = test;
                    })
                    .catch(e => {
                        this.showError = e;
                    });
            });
        this.profileForm.get('password')?.valueChanges.subscribe(value => {
            const test = owasp.test(value);
            this.passedTests = test.passedTests;
            this.strong = test.strong || test.isPassphrase;
        });
        this.profileForm.get('password2')?.valueChanges.subscribe(value => {
            this.confirm = this.strong && this.profileForm.get('password')?.value === value;
        });
        this.profileForm
            .get('email')
            ?.valueChanges.pipe(debounceTime(500))
            .subscribe(value => {
                this.userService
                    .test('email', value)
                    .then(test => {
                        this.usernameExist = test;
                    })
                    .catch(e => {
                        this.showError = e;
                    });
            });

        owasp.config({
            allowPassphrases: true,
            minLength: 10,
            minPhraseLength: 20,
            minOptionalTestsToPass: 4,
        });
    }

    ngOnDestroy(): void {
        this.listener.forEach(e => e.unsubscribe());
    }

    submit() {
        const value = this.profileForm.value;

        const test = owasp.test(value.password);

        this.showError = [];

        if (this.usernameExist) {
            this.showError.push(this.translate.instant('error.username.exist'));
        }
        if (this.emailExist) {
            this.showError.push(this.translate.instant('error.email.exist'));
        }
        if (value.password !== value.password2) {
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
            //     .signup(value.username, value.password, value.email)
            //     .then(() => {
            //         this.router.navigate(['/user/profile']);
            //     })
            //     .catch(e => {
            //         this.showError = e;
            //     });
        }
    }
}
