import { Component, input, numberAttribute } from '@angular/core';

/**
 * Tiles loader with fake tile
 */
@Component({
    selector: 'loader-item',
    templateUrl: './loader-item.component.html',
    styleUrls: ['./loader-item.component.css'],
    standalone: true,
})
export class LoaderItemComponent {
    // input

    readonly mode = input<'tile' | 'list'>('tile');
    readonly nombre = input(2, { transform: numberAttribute });

    // template

    get list() {
        return new Array(this.nombre);
    }
}
