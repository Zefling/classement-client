import { Component, Input } from '@angular/core';


@Component({
    selector: 'loader-item',
    templateUrl: './loader-item.component.html',
    styleUrls: ['./loader-item.component.scss'],
})
export class LoaderItemComponent {
    @Input()
    mode: 'tile' | 'list' = 'tile';

    @Input()
    nombre: number = 2;

    get list() {
        return new Array(this.nombre);
    }
}
