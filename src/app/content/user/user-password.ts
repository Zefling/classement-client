import { FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import owasp from 'owasp-password-strength-test';

import { MessageService } from 'src/app/components/info-messages.component';
import { APIUserService } from 'src/app/services/api.user.service';


export abstract class UserPassword {
    showError: string[] = [];
    changePasswordForm: FormGroup;
    strong = false;
    confirm = false;
    passedTests: number[] = [];

    constructor(
        protected userService: APIUserService,
        protected messageService: MessageService,
        protected translate: TranslateService,
    ) {
        this.changePasswordForm = new FormGroup(this.formGroupPasswordForm());

        this.changePasswordForm.get('password')?.valueChanges.subscribe(value => {
            const test = owasp.test(value);
            this.passedTests = test.passedTests;
            this.strong = test.strong || test.isPassphrase;
        });
        this.changePasswordForm.get('password2')?.valueChanges.subscribe(value => {
            this.confirm = this.strong && this.changePasswordForm.get('password')?.value === value;
        });
    }

    abstract formGroupPasswordForm(): any;

    valideChangePassword() {
        var value = this.changePasswordForm.value;

        const test = owasp.test(value.password);

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

        return value;
    }
}
