import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
    MagmaClickEnterDirective,
    MagmaClickOutsideDirective,
    MagmaColorPicker,
    MagmaContextMenu,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaNgInitDirective,
    MagmaNgModelChangeDebouncedDirective,
    MagmaPopoverDirective,
} from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { ClassementModeGroupBase } from './classement-mode-base';

import { TileContentComponent } from '../../../components/tile-content/tile-content.component';
import { RemoveTileDirective } from '../../../directives/remove-tile.directive';
import { ColOption, ColumnOption, FileType, FormattedGroup } from '../../../interface/interface';
import { color } from '../../../tools/function';

@Component({
    selector: 'classement-mode-table',
    templateUrl: './classement-mode-table.component.html',
    styleUrl: './classement-mode-table.component.scss',
    imports: [
        FormsModule,
        TranslocoPipe,
        CdkDropList,
        CdkDrag,
        MagmaContextMenu,
        MagmaNgInitDirective,
        MagmaNgModelChangeDebouncedDirective,
        MagmaColorPicker,
        MagmaClickEnterDirective,
        MagmaClickOutsideDirective,
        MagmaInput,
        MagmaInputCheckbox,
        MagmaInputElement,
        MagmaPopoverDirective,
        RemoveTileDirective,
        TileContentComponent,
    ],
})
export class ClassementModeTableComponent extends ClassementModeGroupBase {
    /** tableCellList() is owned by the parent (because _tableCellCache lives there). */
    readonly tableCellList = input.required<(group: FormattedGroup, colIdx: number) => FileType[]>();

    readonly updateColOption = output<ColOption>();
    readonly tableColLeft = output<number>();
    readonly tableColRight = output<number>();
    readonly tableColDelete = output<number>();
    readonly tableColAdd = output<number>();
    readonly colWidthChange = output<{ col: ColumnOption; width: string | undefined }>();

    color = color;
}
