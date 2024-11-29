import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injectable, inject } from '@angular/core';

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
    styleUrls: ['./info-messages.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [InfoMessageComponent],
})
export class InfoMessagesComponent {
    // inject

    private readonly messageService = inject(MessageService);
    private readonly cd = inject(ChangeDetectorRef);

    // template

    readonly messages: Message[] = [];

    constructor() {
        this.messageService.onAddMessage.subscribe((message: Message) => {
            this.messages.push(message);
            this.cd.detectChanges();
        });
    }

    destruct(message: Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
        this.cd.detectChanges();
    }
}
