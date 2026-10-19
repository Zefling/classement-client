import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, DestroyRef, Directive, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ContextMenuItem } from '@ikilote/magma';

import { CdkDragElement } from '../../../directives/drag-element.directive';
import { FileString, FileType, FormattedGroup, GroupOption, Options } from '../../../interface/interface';
import { GlobalService } from '../../../services/global.service';

/** Payload emitted when a tile is (de)selected via mouse/keyboard. */
export interface SelectItemEvent {
    event: KeyboardEvent | MouseEvent | null;
    group: FormattedGroup | null;
    item: FileType;
    index: number | null;
    div: HTMLDivElement | null;
}

/** Payload emitted when a key navigation targets a tile. */
export interface SelectItemByKeyEvent {
    event: KeyboardEvent;
    group: FormattedGroup | null;
    item: FileType;
    index: number | null;
    /** Free-drag handle, only provided by the zone mode (iceberg / axis). */
    drag?: CdkDragElement | null;
}

/**
 * Shared inputs/outputs and helpers for every editor "mode" sub-component
 * (tierlist, zone, bingo, table, columns). Each mode is rendered inside the
 * parent `classement-edit` cdkDropListGroup and delegates all state mutations
 * back to the parent through these outputs.
 */
@Directive()
export abstract class ClassementModeBase {
    private readonly global = inject(GlobalService);
    private readonly cd = inject(ChangeDetectorRef);

    // shared inputs
    readonly options = input.required<Options>();
    readonly groups = input.required<FormattedGroup[]>();
    readonly selectionTile = input<FileType>(null);
    readonly selectionGroup = input<FormattedGroup | null>(null);
    readonly contextMenu = input<ContextMenuItem<{ item: FileType; group: FormattedGroup; index: number }>[]>([]);

    // shared outputs
    readonly drop = output<CdkDragDrop<{ list: FileType[]; index: number }>>();
    readonly removeFromGroup = output<{ list: FileType[]; index: number }>();
    readonly selectItem = output<SelectItemEvent>();
    readonly selectItemClear = output<void>();
    readonly selectItemByKey = output<SelectItemByKeyEvent>();
    readonly selectMoveItem = output<{ event: KeyboardEvent; list: FileType[] }>();
    readonly openTileInfo = output<FileString>();
    readonly detectChanges = output<void>();
    readonly selectionDivChange = output<HTMLDivElement | null>();

    constructor() {
        this.global.onInfoImmediatChange.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(() => {
            this.cd.detectChanges();
        });
    }

    trackByFnFileString(_index: number, item: FileType) {
        return item?.url || item?.id || _index;
    }
}

/**
 * Adds the group edition outputs shared by the grid-like modes that render a
 * per-group name cell + action buttons (tierlist, columns, table).
 */
@Directive()
export abstract class ClassementModeGroupBase extends ClassementModeBase {
    readonly globalChange = output<void>();
    readonly selectionGroupForItem = output<FormattedGroup>();
    readonly updateGroupOption = output<GroupOption>();
    readonly upLine = output<number>();
    readonly downLine = output<number>();
    readonly deleteLine = output<number>();
    readonly addLine = output<number>();
}
