import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, inject, input } from '@angular/core';

import { MagmaTooltipDirective } from '@ikilote/magma';

import { FileString, Options } from 'src/app/interface/interface';
import { Utils } from 'src/app/tools/utils';

@Component({
    selector: 'tile-item',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss'],
    host: {
        '[style.--over-item-background]': 'item().bgColor',
        '[style.--over-item-text-color]': 'item().txtColor',
    },
    imports: [NgClass, MagmaTooltipDirective],
})
export class TileComponent {
    protected readonly cd = inject(ChangeDetectorRef);

    readonly item = input.required<FileString>();
    readonly options = input.required<Options>();
    readonly imagesCache = input<Record<string, string | ArrayBuffer | null> | undefined>();

    calcWidth(element: HTMLElement | null) {
        // hack for calcule de width of the image
        Utils.calcWidth(this.options(), this.item(), element);
        return true;
    }
}
