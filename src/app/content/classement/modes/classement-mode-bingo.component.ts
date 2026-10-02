import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import { Component, output } from '@angular/core';

import {
    MagmaClickEnterDirective,
    MagmaClickOutsideDirective,
    MagmaContextMenu,
    MagmaNgInitDirective,
} from '@ikilote/magma';

import { ClassementModeBase } from './classement-mode-base';

import { RemoveTileDirective } from '../../../directives/remove-tile.directive';
import { FormattedGroup } from '../../../interface/interface';

@Component({
    selector: 'classement-mode-bingo',
    templateUrl: './classement-mode-bingo.component.html',
    styleUrl: './classement-mode-bingo.component.scss',
    imports: [
        NgClass,
        CdkDropList,
        CdkDrag,
        MagmaContextMenu,
        MagmaNgInitDirective,
        MagmaClickEnterDirective,
        MagmaClickOutsideDirective,
        RemoveTileDirective,
    ],
})
export class ClassementModeBingoComponent extends ClassementModeBase {
    readonly globalChange = output<void>();
    readonly change = output<void>();
    // bingo targets a specific cell index, unlike the grid modes
    readonly selectionGroupForItem = output<{ group: FormattedGroup; index: number | null }>();
}
