import { Component, Injectable } from '@angular/core';

import { Subject } from 'rxjs';

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
})
export class InfoMessagesComponent {
    messages: Message[] = [];

    constructor(messsageService: MessageService) {
        messsageService.onAddMessage.subscribe((message: Message) => {
            this.messages.push(message);
        });
    }

    destruct(message: Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
    }
}
