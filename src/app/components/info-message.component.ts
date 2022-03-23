import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

import { Message } from './info-messages.component';


@Component({
    selector: 'info-message',
    templateUrl: './info-message.component.html',
    styleUrls: ['./info-message.component.scss'],
})
export class InfoMessageComponent {
    @Input()
    message?: Message;

    @Output()
    destruct = new EventEmitter<Message>();

    @HostBinding('ngClass')
    get classes() {
        return this.message?.type;
    }
    @HostBinding('class.close')
    get closeClass() {
        return this._closeClass;
    }

    @HostBinding('style.--current-pos.px')
    get currentPos() {
        return this._pos ?? null;
    }

    @HostBinding('style.--current-height.px')
    get currentHeight() {
        return this._height ?? null;
    }

    private _closeClass = false;
    private _pos!: number;
    private _height!: number;

    constructor(private element: ElementRef) {}

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
        this.destruct.emit(this.message);
    }
}
