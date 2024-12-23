import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { MessageService, MessageType } from 'src/app/components/info-messages/info-messages.component';
import { APIUserService } from 'src/app/services/api.user.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';

import { TextareaAutosizeDirective } from '../../directives/textarea-autosize.directive';

@Component({
    selector: 'user-information',
    templateUrl: './user-information.component.html',
    styleUrls: ['./user-information.component.scss'],
    imports: [FormsModule, TextareaAutosizeDirective, TranslocoPipe],
})
export class UserInformationComponent {
    private readonly userService = inject(APIUserService);
    private readonly messageService = inject(MessageService);
    private readonly translate = inject(TranslocoService);
    private readonly global = inject(GlobalService);

    text = '';
    username = '';
    email = '';

    private _sub = Subscriptions.instance();

    constructor() {
        this.updateTitle();

        if (this.userService.user) {
            this.username = this.userService.user.username;
        }

        this._sub.push(
            this.translate.langChanges$.subscribe(() => {
                this.updateTitle();
            }),
        );
    }

    updateTitle() {
        this.global.setTitle('menu.information');
    }

    invalideMessage(): boolean {
        return this.text.trim().length < 20 || !Utils.testEmail(this.email) || !this.username.trim().length;
    }

    send() {
        if (this.username.trim().length && this.email.trim().length && this.text.trim().length) {
            this.userService
                .sendToAdmin(this.username, this.email, this.text)
                .then(() => {
                    this.text = '';
                    this.messageService.addMessage(this.translate.translate('message.contact.sent.success'));
                })
                .catch(e => {
                    this.messageService.addMessage(e, { type: MessageType.error });
                });
        }
    }
}
