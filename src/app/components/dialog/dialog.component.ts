import { Component, HostBinding, Input, booleanAttribute } from '@angular/core';

@Component({
    selector: 'dialog-cmp',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
    @Input({ transform: booleanAttribute })
    closeButton = false;

    @HostBinding('class.open')
    _open = false;

    open() {
        this._open = true;
    }

    close() {
        this._open = false;
    }
}
