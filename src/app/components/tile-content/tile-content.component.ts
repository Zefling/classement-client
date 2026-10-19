import { ChangeDetectorRef, Component, DestroyRef, ElementRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MagmaClickEnterDirective, MagmaNgInitDirective } from '@ikilote/magma';

import { FileString, Options } from '../../interface/interface';
import { GlobalService } from '../../services/global.service';
import { Utils } from '../../tools/utils';

/**
 * Renders the `div.content.content-render` block shared by all editor
 * mode components (tierlist, columns, zone, table, bingo).
 *
 * The host element IS the content-render div — classes and id are bound on
 * :host so that Utils.calcWidth can apply style.width directly via ElementRef.
 * The surrounding `content-box` / cdkDrag wrapper is left to each mode.
 * The parent must only render this component inside an @if (item) guard.
 */
@Component({
    selector: 'tile-content',
    templateUrl: './tile-content.component.html',
    styleUrl: './tile-content.component.scss',
    imports: [MagmaNgInitDirective, MagmaClickEnterDirective],
    host: {
        '[class]': 'hostClasses',
        '[attr.id]': 'item().id',
    },
})
export class TileContentComponent {
    private readonly global = inject(GlobalService);
    private readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly cd = inject(ChangeDetectorRef);

    readonly item = input.required<FileString>();
    readonly options = input.required<Options>();

    /**
     * When `true`, the title span becomes `contenteditable` (bingo mode only).
     * Mutually exclusive with a tile that has a URL — if both are set, the
     * non-editable span is rendered as a fallback.
     */
    readonly editableTitle = input(false);

    readonly detectChanges = output<void>();
    readonly openTileInfo = output<FileString>();
    /** Emits the new trimmed text when the editable title loses focus (bingo). */
    readonly titleChange = output<string>();

    constructor() {
        // When any option changes (width-auto, text position, etc.), force a
        // re-check of this component's template so [class.image]="calcWidth()"
        // is re-evaluated with the latest options values.
        this.global.onInfoImmediatChange.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(id => {
            if (id === undefined || id === this.item().id) {
                this.cd.detectChanges();
                this.calcWidth();
            }
        });
    }

    /** Classes applied on :host — replaces the removed div.content.content-render wrapper. */
    get hostClasses(): Record<string, boolean> {
        const pos = this.options().itemTextPosition ?? '';
        return {
            content: true,
            'content-render': true,
            'with-annotation': !!this.item().annotation,
            [pos]: !!pos,
        };
    }

    /**
     * Called via [class.image] binding (re-evaluated on every CD cycle) and
     * via (load) on the img. Always returns true so .image class is applied.
     * Does NOT emit detectChanges to avoid a CD loop.
     */
    calcWidth(): boolean {
        Utils.calcWidth(this.options(), this.item(), this.elRef.nativeElement);
        return true;
    }
}
