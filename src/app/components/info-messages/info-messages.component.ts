import { Component, Injectable, inject } from '@angular/core';

import { Subject } from 'rxjs';

import { InfoMessageComponent } from './info-message.component';

export enum MessageType {
    info = 'info',
    error = 'error',
}

export interface Message {
    message: string;
    type: MessageType;
    time: string;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
    readonly onAddMessage = new Subject<Message>();

    addMessage(message: string, options: { type?: MessageType; time?: string } = {}) {
        this.onAddMessage.next({ message, type: options.type || MessageType.info, time: options.time || '3s' });
    }
}

@Component({
    selector: 'info-messages',
    templateUrl: './info-messages.component.html',
    styleUrls: ['./info-messages.component.scss'],
    standalone: true,
    imports: [InfoMessageComponent],
})
export class InfoMessagesComponent {
    messages: Message[] = [];

    constructor() {
        const messageService = inject(MessageService);

        messageService.onAddMessage.subscribe((message: Message) => {
            this.messages.push(message);
        });
    }

    destruct(message: Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
    }
}
