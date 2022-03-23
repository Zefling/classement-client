import { Component, Injectable } from '@angular/core';

import { Subject } from 'rxjs';


export type MessageType = 'info' | 'error';

export interface Message {
    message: string;
    type: MessageType;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
    readonly onAddMessage = new Subject<Message>();

    addMessage(message: string, type: MessageType = 'info') {
        this.onAddMessage.next({ message, type });
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
            console.log('Message');
            this.messages.push(message);
        });
    }

    destruct(message: Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
    }
}
