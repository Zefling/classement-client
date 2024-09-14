import { booleanAttribute, Component, HostBinding, HostListener, input, output } from '@angular/core';

@Component({
    selector: 'dialog-cmp',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
    // input

    closeButton = input(false, { transform: booleanAttribute });
    closeBackdrop = input(false, { transform: booleanAttribute });

    // output

    onClose = output();

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
