import { Component, HostBinding, HostListener, booleanAttribute, input, output } from '@angular/core';

@Component({
    selector: 'dialog-cmp',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    standalone: true,
})
export class DialogComponent {
    // input

    readonly closeButton = input(false, { transform: booleanAttribute });
    readonly closeBackdrop = input(false, { transform: booleanAttribute });

    // output

    readonly onClose = output();

    // host

    @HostBinding('class.open') _open = false;

    @HostListener('click')
    onClick() {
        if (this.closeBackdrop()) {
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
        window.dispatchEvent(new CustomEvent('dialog-click', { detail: event }));
    }
}
