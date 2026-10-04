import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Component, output } from '@angular/core';

import {
    MagmaClickEnterDirective,
    MagmaClickOutsideDirective,
    MagmaContextMenu,
    MagmaNgInitDirective,
} from '@ikilote/magma';

import { ClassementModeBase } from './classement-mode-base';

import { TileContentComponent } from '../../../components/tile-content/tile-content.component';
import { ZoneAreaComponent } from '../../../components/zone-area/zone-area.component';
import { ZoneAxisComponent } from '../../../components/zone-axis/zone-axis.component';
import { CdkDragElement } from '../../../directives/drag-element.directive';
import { CdkDropZone } from '../../../directives/dropzone.directive';
import { RemoveTileDirective } from '../../../directives/remove-tile.directive';
import { FileString, FormattedGroup } from '../../../interface/interface';

@Component({
    selector: 'classement-mode-zone',
    templateUrl: './classement-mode-zone.component.html',
    styleUrl: './classement-mode-zone.component.scss',
    imports: [
        CdkDragElement,
        CdkDropZone,
        MagmaContextMenu,
        MagmaNgInitDirective,
        MagmaClickEnterDirective,
        MagmaClickOutsideDirective,
        RemoveTileDirective,
        ZoneAreaComponent,
        ZoneAxisComponent,
        TileContentComponent,
    ],
})
export class ClassementModeZoneComponent extends ClassementModeBase {
    readonly clickZone = output<MouseEvent | KeyboardEvent>();
    readonly createTile = output<MouseEvent>();
    readonly stopEvent = output<Event>();
    readonly initItem = output<{ element: CdkDragElement; pos: { x: number; y: number } }>();
    readonly moveItem = output<{ event: CdkDragMove<any>; item: FileString; element: CdkDragElement }>();
    readonly moveItemEnd = output<void>();
    readonly selectionGroupForItem = output<FormattedGroup>();
    readonly selectionDragChange = output<CdkDragElement | null>();
}
