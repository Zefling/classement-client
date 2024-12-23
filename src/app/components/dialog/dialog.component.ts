import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    HostListener,
    booleanAttribute,
    inject,
    input,
    output,
} from '@angular/core';

@Component({
    selector: 'dialog-cmp',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
    // inject

    private readonly cd = inject(ChangeDetectorRef);

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
        this.cd.detectChanges();
    }

    close() {
        this._open = false;
        this.cd.detectChanges();
        this.onClose.emit();
    }

    _propagationStop(event: Event) {
        event.stopPropagation();
        window.dispatchEvent(new CustomEvent('dialog-click', { detail: event }));
    }
}
