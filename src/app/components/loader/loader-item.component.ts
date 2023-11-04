import { Component, Input, numberAttribute } from '@angular/core';

/**
 * Tiles loader with fake tile
 */
@Component({
    selector: 'loader-item',
    templateUrl: './loader-item.component.html',
    styleUrls: ['./loader-item.component.scss'],
})
export class LoaderItemComponent {
    @Input() mode: 'tile' | 'list' = 'tile';

    @Input({ transform: numberAttribute }) nombre = 2;

    get list() {
        return new Array(this.nombre);
    }
}
