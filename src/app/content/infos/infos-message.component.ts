import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
    MagmaInputTextarea,
    MagmaMessageType,
    MagmaMessages,
    Subscriptions,
} from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { APIUserService } from '../../services/api.user.service';
import { GlobalService } from '../../services/global.service';

@Component({
    selector: 'infos-message',
    templateUrl: './infos-message.component.html',
    styleUrls: ['./infos-message.component.scss'],

    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, TranslocoPipe, MagmaInput, MagmaInputElement, MagmaInputText, MagmaInputTextarea],
})
export class InfosMessageComponent {
    private readonly userService = inject(APIUserService);
    private readonly mgMessage = inject(MagmaMessages);
    private readonly translate = inject(TranslocoService);
    private readonly global = inject(GlobalService);
    private readonly router = inject(Router);
    private readonly fbe = inject(FormBuilderExtended);

    private _sub = Subscriptions.instance();

    readonly formConfig: FormGroup<{
        username: FormControl<string>;
        email: FormControl<string>;
        message: FormControl<string>;
    }>;

    constructor() {
        this.updateTitle();

        this._sub.push(
            this.translate.langChanges$.subscribe(() => {
                this.updateTitle();
            }),
        );

        if (!this.global.withApi()) {
            this.router.navigate(['/infos/licenses']);
        }

        const base = 'user.information.contact.admin.error.';

        this.formConfig = this.fbe.groupWithError({
            username: {
                default: this.userService.user?.username ?? '',
                control: {
                    required: { state: true, message: () => this.translate.translate(base + 'username.required') },
                },
            },
            email: {
                default: '',
                control: {
                    required: { state: true, message: () => this.translate.translate(base + 'email.required') },
                    email: { message: () => this.translate.translate(base + 'email.email') },
                },
            },
            message: {
                default: '',
                control: {
                    required: { state: true, message: () => this.translate.translate(base + 'message.required') },
                    minlength: { state: 20, message: () => this.translate.translate(base + 'message.minlength') },
                    maxlength: { state: 5000, message: () => this.translate.translate(base + 'message.maxlength') },
                },
            },
        });
    }

    updateTitle() {
        this.global.setTitle('infos.title');
    }

    send() {
        this.fbe.validateForm(this.formConfig);
        if (this.formConfig.valid) {
            this.userService
                .sendToAdmin(this.formConfig.value as { username: string; email: string; message: string })
                .then(() => {
                    const message = this.formConfig.get('message');
                    message?.setValue('');
                    message?.markAsUntouched();
                    message?.markAsPristine();
                    this.mgMessage.addMessage(this.translate.translate('message.contact.sent.success'));
                })
                .catch(e => {
                    this.mgMessage.addMessage(e, { type: MagmaMessageType.error });
                });
        }
    }
}
