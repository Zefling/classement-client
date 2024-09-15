import { Component, input, numberAttribute } from '@angular/core';

/**
 * Tiles loader with fake tile
 */
@Component({
    selector: 'loader-item',
    templateUrl: './loader-item.component.html',
    styleUrls: ['./loader-item.component.scss'],
    standalone: true,
})
export class LoaderItemComponent {
    mode = input<'tile' | 'list'>('tile');
    nombre = input(2, { transform: numberAttribute });

    get list() {
        return new Array(this.nombre);
    }
}
