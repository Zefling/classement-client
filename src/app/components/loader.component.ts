import { Component, Input } from '@angular/core';


@Component({
    selector: 'loader-cmp',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
    @Input()
    message!: string;

    @Input()
    progress!: number;
}
