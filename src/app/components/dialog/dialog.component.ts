import { Component, EventEmitter, HostBinding, HostListener, Input, Output, booleanAttribute } from '@angular/core';

@Component({
    selector: 'dialog-cmp',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
    @Input({ transform: booleanAttribute }) closeButton = false;
    @Input({ transform: booleanAttribute }) closeBackdrop = false;

    @Output() onClose = new EventEmitter();

    @HostBinding('class.open') _open = false;

    @HostListener('click')
    onClick() {
        if (this.closeBackdrop) {
            this.close();
        }
    }

    open() {
        this._open = true;
    }

    close() {
        this._open = false;
        this.onClose.emit();
    }

    _propagationStop(event: Event) {
        event.stopPropagation();
    }
}
