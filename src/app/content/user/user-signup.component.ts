import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import owasp from 'owasp-password-strength-test';
import { debounceTime } from 'rxjs';

import { MessageService } from 'src/app/components/info-messages/info-messages.component';
import { APIUserService } from 'src/app/services/api.user.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'user-signup',
    templateUrl: './user-signup.component.html',
    styleUrls: ['./user-signup.component.css'],
    imports: [FormsModule, ReactiveFormsModule, RouterLink, TranslocoPipe],
})
export class UserSignupComponent implements OnDestroy {
    private readonly router = inject(Router);
    private readonly userService = inject(APIUserService);
    private readonly messageService = inject(MessageService);
    private readonly translate = inject(TranslocoService);
    private readonly global = inject(GlobalService);

    profileForm: FormGroup;
    usernameExist = false;
    emailExist = false;
    emailInvalide = false;
    showError: string[] = [];
    passedTests: number[] = [];
    strong = false;
    confirm = false;

    listener = Subscriptions.instance();

    constructor() {
        this.updateTitle();

        this.profileForm = new FormGroup({
            username: new FormControl(''),
            password: new FormControl(''),
            password2: new FormControl(''),
            email: new FormControl(''),
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

        this.profileForm
            .get('username')
            ?.valueChanges.pipe(debounceTime(500))
            .subscribe(value => {
                if (value) {
                    this.userService.test('username', value).then(test => {
                        this.usernameExist = test;
                    });
                }
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
                if (Utils.testEmail(value)) {
                    this.emailInvalide = false;
                    this.userService.test('email', value).then(test => {
                        this.emailExist = test;
                    });
                } else if (value) {
                    this.emailInvalide = true;
                }
            });

        owasp.config({
            allowPassphrases: true,
            minLength: 10,
            minPhraseLength: 20,
            minOptionalTestsToPass: 4,
        });
    }

    updateTitle() {
        this.global.setTitle('menu.sign-up');
    }

    ngOnDestroy(): void {
        this.listener.clear();
    }

    submit() {
        const value = this.profileForm.value;

        const test = owasp.test(value.password);

        this.showError = [];

        if (value.username.trim() === '') {
            this.showError.push(this.translate.translate('error.api-code.1001'));
        } else if (this.usernameExist) {
            this.showError.push(this.translate.translate('error.username.exist'));
            this.usernameExist = true;
        }
        if (value.email.trim() === '') {
            this.showError.push(this.translate.translate('error.api-code.1020'));
        } else if (this.emailInvalide) {
            this.showError.push(this.translate.translate('error.email.invalid'));
        } else if (this.emailExist) {
            this.showError.push(this.translate.translate('error.email.exist'));
            this.emailExist = true;
        }
        if (value.password !== value.password2) {
            this.showError.push(this.translate.translate('error.pw.duplicate'));
            this.confirm = false;
        }
        if (test.errors?.length) {
            test.errors.forEach(e =>
                this.showError.push(
                    this.translate
                        .translate('error.owasp.' + e.replace(/\d+/, '*'))
                        .replace('%', e.match(/\d+/)?.[0] ?? ''),
                ),
            );
        }

        if (!this.showError.length) {
            this.userService
                .signup(value.username, value.password, value.email)
                .then(() => {
                    this.messageService.addMessage(this.translate.translate('message.user.sign.up.success'));
                    this.router.navigate(['/user/login']);
                })
                .catch(e => {
                    this.showError = [e];
                });
        }
    }

    oauth(service: string) {
        window.location.href = `${environment.api.path}connect/${service}`;
    }
}
