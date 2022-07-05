import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import owasp from 'owasp-password-strength-test';
import { debounceTime, Subscription } from 'rxjs';

import { UserService } from 'src/app/services/user.service';


@Component({
    selector: 'user-signup',
    templateUrl: './user-signup.component.html',
    styleUrls: ['./user-signup.component.scss'],
})
export class UserSignupComponent implements OnDestroy {
    profileForm: FormGroup;
    showError: string[] = [];
    passedTests: number[] = [];
    strong = false;
    confirm = false;

    listener: Subscription[] = [];

    constructor(private router: Router, private userService: UserService, private translate: TranslateService) {
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
                console.log('username', value);
            });

        this.profileForm.get('password')?.valueChanges.subscribe(value => {
            const test = owasp.test(value);
            console.log('test', test);
            this.passedTests = test.passedTests;
            this.strong = test.strong || test.isPassphrase;
        });
        this.profileForm.get('password2')?.valueChanges.subscribe(value => {
            this.confirm = this.strong && this.profileForm.get('password')?.value === value;
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
