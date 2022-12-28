import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'loading-cmp',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
    @Input()
    @HostBinding('style.--height')
    size!: string;

    @Input()
    @HostBinding('style.--width')
    tickWidth!: string;
}
