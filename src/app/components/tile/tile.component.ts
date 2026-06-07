import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input } from '@angular/core';

import { MagmaTooltipDirective } from '@ikilote/magma';

import { FileString, Options } from '../../interface/interface';
import { Utils } from '../../tools/utils';

@Component({
    selector: 'tile-item',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.scss'],
    host: {
        '[style.--over-item-background]': 'item().bgColor',
        '[style.--over-item-text-color]': 'item().txtColor',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass, MagmaTooltipDirective],
})
export class TileComponent {
    private readonly cd = inject(ChangeDetectorRef);

    readonly item = input.required<FileString>();
    readonly options = input.required<Options>();
    readonly imagesCache = input<Record<string, string | ArrayBuffer | null> | undefined>();

    markForCheck() {
        this.cd.markForCheck();
    }

    calcWidth(element: HTMLElement | null) {
        // hack for calcule de width of the image
        Utils.calcWidth(this.options(), this.item(), element);
        return true;
    }
}
