import { FormGroup } from '@angular/forms';

import { MagmaMessage } from '@ikilote/magma';
import { TranslocoService } from '@jsverse/transloco';

import oWasp from 'owasp-password-strength-test';

import { APIUserService } from 'src/app/services/api.user.service';

export abstract class UserPassword {
    showError: string[] = [];
    changePasswordForm: FormGroup;
    strong = false;
    confirm = false;
    passedTests: number[] = [];

    constructor(
        protected userService: APIUserService,
        protected mgMessage: MagmaMessage,
        protected translate: TranslocoService,
    ) {
        this.changePasswordForm = new FormGroup(this.formGroupPasswordForm());

        this.changePasswordForm.get('password')?.valueChanges.subscribe(value => {
            const test = oWasp.test(value);
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

        const test = oWasp.test(value.password);

        if (value.password !== value.password2) {
            this.showError.push(this.translate.translate('error.pw.duplicate'));
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

        return value;
    }
}
