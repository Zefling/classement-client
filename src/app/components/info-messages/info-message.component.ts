import { Component, ElementRef, HostBinding, HostListener, inject, input, output } from '@angular/core';

import { Message } from './info-messages.component';

@Component({
    selector: 'info-message',
    templateUrl: './info-message.component.html',
    styleUrls: ['./info-message.component.scss'],
    standalone: true,
})
export class InfoMessageComponent {
    private readonly element = inject(ElementRef);

    message = input<Message>();

    destruct = output<Message>();

    @HostBinding('class')
    get classes() {
        return [this.message()?.type, this._closeClass ? 'close' : null];
    }

    @HostBinding('style.--current-pos.px')
    get currentPos() {
        return this._pos ?? null;
    }

    @HostBinding('style.--current-height.px')
    get currentHeight() {
        return this._height ?? null;
    }

    @HostBinding('style.--info-message-progress-time')
    get progressTime() {
        return this.message()?.time;
    }

    private _closeClass = false;
    private _pos!: number;
    private _height!: number;

    @HostListener('click')
    click() {
        this._pos = this.element?.nativeElement.offsetTop;
        this._height = this.element?.nativeElement.height;
        this._closeClass = true;

        setTimeout(() => {
            this.close();
        }, 700);
    }

    animationend() {
        this.click();
    }

    close() {
        this.destruct.emit(this.message()!);
    }
}
