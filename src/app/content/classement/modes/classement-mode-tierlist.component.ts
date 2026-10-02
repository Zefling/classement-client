import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
    MagmaClickEnterDirective,
    MagmaClickOutsideDirective,
    MagmaColorPicker,
    MagmaContextMenu,
    MagmaNgInitDirective,
    MagmaNgModelChangeDebouncedDirective,
    MagmaPopoverDirective,
} from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { ClassementModeGroupBase } from './classement-mode-base';

import { RemoveTileDirective } from '../../../directives/remove-tile.directive';
import { color } from '../../../tools/function';

@Component({
    selector: 'classement-mode-tierlist',
    templateUrl: './classement-mode-tierlist.component.html',
    styleUrl: './classement-mode-tierlist.component.scss',
    imports: [
        NgClass,
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
        MagmaPopoverDirective,
        RemoveTileDirective,
    ],
})
export class ClassementModeTierlistComponent extends ClassementModeGroupBase {
    color = color;
}
