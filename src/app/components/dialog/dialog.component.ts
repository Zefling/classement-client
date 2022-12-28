import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'dialog-cmp',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
    @Input()
    set closeButton(value: any) {
        this._closeButton = this._coerceBooleanProperty(value);
    }
    _closeButton = false;

    @HostBinding('class.open')
    _open = false;

    open() {
        this._open = true;
    }

    close() {
        this._open = false;
    }

    private _coerceBooleanProperty(value: any): boolean {
        return value != null && `${value}` !== 'false';
    }
}
