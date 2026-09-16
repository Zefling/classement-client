import {
    ChangeDetectorRef,
    Component,
    OnChanges,
    SimpleChanges,
    inject,
    input,
    output,
    viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
    Logger,
    MagmaDialog,
    MagmaInput,
    MagmaInputColor,
    MagmaInputElement,
    MagmaInputText,
    MagmaInputTextarea,
    MagmaStopPropagationDirective,
} from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { Subject, debounceTime } from 'rxjs';

import { ImagePickComponent } from '../../../components/image-pick/image-pick.component';
import { FileString, Options } from '../../../interface/interface';
import { GlobalService } from '../../../services/global.service';
import { ClassementEditComponent } from '../classement-edit.component';

@Component({
    selector: 'classement-edit-image',
    templateUrl: './classement-edit-image.component.html',
    styleUrls: ['./classement-edit-image.component.scss'],
    imports: [
        MagmaDialog,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaInputTextarea,
        MagmaInputColor,
        MagmaStopPropagationDirective,
        FormsModule,
        ImagePickComponent,
        TranslocoPipe,
    ],
})
export class ClassementEditImageComponent implements OnChanges {
    private readonly cd = inject(ChangeDetectorRef);
    private readonly global = inject(GlobalService);
    private readonly logger = inject(Logger);
    private readonly editor = inject(ClassementEditComponent, { host: true });

    // viewChild

    dialogInfo = viewChild.required<MagmaDialog>('dialogInfo');

    // input

    currentTile = input<FileString>();

    // output

    deleteCurrent = output<void>();

    _open = false;

    colorListBg?: Set<string>;
    colorListTxt?: Set<string>;

    _options?: Options;

    private _detectChange = new Subject<void>();

    constructor() {
        this._detectChange.pipe(debounceTime(10)).subscribe(() => {
            this.cd.markForCheck();
            this.globalChange();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['currentTile']) {
            // list colors background
            const bgColors = new Set<string>();
            this.editor.list.forEach(e => (e?.bgColor ? bgColors.add(e.bgColor) : null));
            this.editor.groups.forEach(e => e.list.forEach(f => (f?.bgColor ? bgColors.add(f.bgColor) : null)));
            this.colorListBg = bgColors;

            // list colors text
            const txtColors = new Set<string>();
            this.editor.list.forEach(e => (e?.txtColor ? txtColors.add(e.txtColor) : null));
            this.editor.groups.forEach(e => e.list.forEach(f => (f?.txtColor ? txtColors.add(f.txtColor) : null)));
            this.colorListTxt = txtColors;
        }
        this._options ??= this.editor.options;
    }

    open() {
        this.dialogInfo().open();
        this._open = true;
    }

    close() {
        this.dialogInfo().close();
        this._open = false;
    }

    delete() {
        this.deleteCurrent.emit();
        this.close();
    }

    detectChanges() {
        this._detectChange.next();
    }

    globalChange() {
        this.editor.globalChange();
    }

    /** Called when image-pick confirms a new cropped image for the tile */
    async onTileImageChange(dataUrl: string | undefined): Promise<void> {
        if (!dataUrl) {
            const tile = this.currentTile()!;
            tile.url = '';
            this.globalChange();
            return;
        }
        const tile = this.currentTile()!;
        setTimeout(() => {
            tile.url = dataUrl;
        });
        tile.realSize = dataUrl.length;
        tile.size = dataUrl.length;
        tile.type = 'image/webp';

        const image = await this.global.imageDimensions(dataUrl);
        tile.height = image.height;
        tile.width = image.width;

        this.global.onImageUpdate.next();
        this.globalChange();
    }

    /**
     * only for iceberg & axis
     */
    tileZIndex(position: 'top' | 'up' | 'down' | 'bottom') {
        const list = this.editor.groups[0].list;
        const index = list.findIndex(e => e?.id === this.currentTile()!.id);
        const item = list.splice(index, 1)[0];

        switch (position) {
            case 'top':
                list.push(item);
                break;
            case 'up':
                list.splice(index + 1, 0, item);
                break;
            case 'down':
                list.splice(index - 1, 0, item);
                break;
            case 'bottom':
                list.unshift(item);
                break;
        }
    }
}
