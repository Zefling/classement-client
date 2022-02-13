import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'dialog-cmp',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
    @HostBinding('class.open')
    @Input()
    open = false;

    close() {
        this.open = false;
    }
}
