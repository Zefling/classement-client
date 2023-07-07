import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { MessageService, MessageType } from 'src/app/components/info-messages/info-messages.component';
import { APIUserService } from 'src/app/services/api.user.service';
import { Utils } from 'src/app/tools/utils';

@Component({
    selector: 'user-information',
    templateUrl: './user-information.component.html',
    styleUrls: ['./user-information.component.scss'],
})
export class UserInformationComponent {
    text = '';
    username = '';
    email = '';

    constructor(
        private readonly userService: APIUserService,
        private readonly messageService: MessageService,
        private readonly translate: TranslateService,
        private readonly title: Title,
    ) {
        this.title.setTitle(`${this.translate.instant('menu.information')} - ${this.translate.instant('classement')}`);

        if (this.userService.user) {
            this.username = this.userService.user.username;
        }
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
                    this.messageService.addMessage(this.translate.instant('message.contact.sent.success'));
                })
                .catch(e => {
                    this.messageService.addMessage(e, { type: MessageType.error });
                });
        }
    }
}
