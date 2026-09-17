import { Injectable, signal } from '@angular/core';

import { ClassementEditComponent } from '../content/classement/classement-edit.component';
import { CdkDragElement } from '../directives/drag-element.directive';
import { FileType, FormattedGroup } from '../interface/interface';

const jumpKeys = ['Home', 'End', 'PageUp', 'PageDown'];

@Injectable({ providedIn: 'root' })
export abstract class EditKeyBoardService {
    readonly selectTile = signal(false);
    readonly selectMainLine = signal(false);

    selectMoveItem(component: ClassementEditComponent, event: KeyboardEvent, group: FileType[]) {
        const index = group.indexOf(component.selectionTile);
        const indexGp = component.groups.findIndex(e => e.list === group);

        // For table mode, indexGp is always -1 because group is a cell sub-list, not group.list.
        // Use tableFindCell to resolve the actual position.
        const isTable = component.options.mode === 'table';

        // In table mode with RTL direction, columns are laid out right-to-left, so keys that move
        // the tile horizontally across columns must be swapped. This only affects the arrow keys
        // (Ctrl / Ctrl+Shift) and the Alt+Home/End column edges; the in-cell order stays logical.
        const rtlTable = isTable && component.options.direction === 'rtl';
        let key = event.key;
        if (rtlTable) {
            if (key === 'ArrowLeft') {
                key = 'ArrowRight';
            } else if (key === 'ArrowRight') {
                key = 'ArrowLeft';
            }
        }

        if (index !== undefined && index !== -1) {
            // Alt-based shortcuts are table-only edge moves (Ctrl+Shift variants are hijacked by
            // the browser: first/last tab). Handle them before the Ctrl block.
            if (isTable && event.altKey && !event.ctrlKey && jumpKeys.includes(event.key)) {
                // For column edges, swap first/last when RTL.
                const colFirst = rtlTable ? 'last' : 'first';
                const colLast = rtlTable ? 'first' : 'last';
                const edgeMap: Record<string, ['row' | 'col', 'first' | 'last']> = {
                    Home: ['col', colFirst],
                    End: ['col', colLast],
                    PageUp: ['row', 'first'],
                    PageDown: ['row', 'last'],
                };
                const [axis, edge] = edgeMap[event.key];
                this.moveTableCellEdge(component, event, axis, edge);
                return;
            }

            if (event.ctrlKey) {
                switch (key) {
                    case 'ArrowLeft':
                        if (
                            (component.options.mode === 'axis' || component.options.mode === 'iceberg') &&
                            indexGp !== -1
                        ) {
                            this.moveLeftZone(component, event, group, index, event.shiftKey ? 1 : 15);
                        } else if (component.options.mode === 'columns' && indexGp !== -1) {
                            this.moveUp(component, event, group, index, indexGp);
                        } else if (isTable && event.shiftKey) {
                            this.moveTableCell(component, event, 0, -1);
                        } else if (isTable) {
                            this.moveTableInCell(component, event, group, index, index - 1);
                        } else {
                            this.moveLeft(component, event, group, index, indexGp);
                        }
                        break;
                    case 'ArrowRight':
                        if (
                            (component.options.mode === 'axis' || component.options.mode === 'iceberg') &&
                            indexGp !== -1
                        ) {
                            this.moveRightZone(component, event, group, index, event.shiftKey ? 1 : 15);
                        } else if (component.options.mode === 'columns' && indexGp !== -1) {
                            this.moveDown(component, event, group, index, indexGp);
                        } else if (isTable && event.shiftKey) {
                            this.moveTableCell(component, event, 0, +1);
                        } else if (isTable) {
                            this.moveTableInCell(component, event, group, index, index + 1);
                        } else {
                            this.moveRight(component, event, group, index, indexGp);
                        }
                        break;
                    case 'ArrowUp':
                        if (
                            (component.options.mode === 'axis' || component.options.mode === 'iceberg') &&
                            indexGp !== -1
                        ) {
                            this.moveUpZone(component, event, group, index, event.shiftKey ? 1 : 15);
                        } else if (component.options.mode === 'bingo') {
                            this.moveUpBingo(component, event, group, index, indexGp);
                        } else if (component.options.mode === 'columns' && indexGp !== -1) {
                            this.moveLeft(component, event, group, index, indexGp);
                        } else if (isTable && event.shiftKey) {
                            this.moveTableCell(component, event, -1, 0);
                        } else if (isTable && indexGp === -1) {
                            // from the main list, send the tile into the table
                            this.moveTableFromMainList(component, event, group, index);
                        } else {
                            this.stopEvent(event);
                        }
                        break;
                    case 'ArrowDown':
                        if (
                            (component.options.mode === 'axis' || component.options.mode === 'iceberg') &&
                            indexGp !== -1
                        ) {
                            this.moveDownZone(component, event, group, index, event.shiftKey ? 1 : 15);
                        } else if (component.options.mode === 'bingo' && indexGp !== -1) {
                            this.moveDownBingo(component, event, group, index, indexGp);
                        } else if (component.options.mode === 'columns' && indexGp !== -1) {
                            this.moveRight(component, event, group, index, indexGp);
                        } else if (isTable && event.shiftKey) {
                            this.moveTableCell(component, event, +1, 0);
                        } else {
                            this.stopEvent(event);
                        }
                        break;
                    case 'Home':
                        if (isTable) {
                            this.moveTableInCell(component, event, group, index, 0);
                        } else {
                            this.moveLeft(component, event, group, index, indexGp, true);
                        }
                        break;
                    case 'End':
                        if (isTable) {
                            this.moveTableInCell(component, event, group, index, group.length - 1);
                        } else {
                            this.moveRight(component, event, group, index, indexGp, true);
                        }
                        break;
                    case 'Delete':
                        if (group) {
                            component.removeFromGroup(group, index);
                            this.clearSelection(component);
                            this.stopEvent(event);
                        }
                        break;
                }
            }
        }
    }

    /** Table mode: move the selected tile by a relative (row, col) offset between cells. */
    private moveTableCell(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        rowDelta: number,
        colDelta: number,
    ) {
        const cell = component.tableFindCell(component.selectionTile);
        if (!cell) {
            this.stopEvent(event);
            return;
        }
        this.moveTableCellTo(component, event, cell, cell.groupIdx + rowDelta, cell.colIdx + colDelta);
    }

    /**
     * Table mode: move the selected tile into the cell at absolute (targetGroupIdx, targetColIdx).
     * `edge` values (first/last row or column) can be resolved with the helper constants below.
     */
    private moveTableCellTo(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        cell: { groupIdx: number; colIdx: number },
        targetGroupIdx: number,
        targetColIdx: number,
    ) {
        const colCount = component.options.col?.length ?? 1;

        if (
            targetGroupIdx < 0 ||
            targetGroupIdx >= component.groups.length ||
            targetColIdx < 0 ||
            targetColIdx >= colCount ||
            (targetGroupIdx === cell.groupIdx && targetColIdx === cell.colIdx)
        ) {
            this.stopEvent(event);
            return;
        }

        const tile = component.selectionTile!;
        // remove from current cell
        const srcList = component.tableCellList(component.groups[cell.groupIdx], cell.colIdx);
        const srcIndex = srcList.indexOf(tile);
        if (srcIndex === -1) {
            this.stopEvent(event);
            return;
        }
        srcList.splice(srcIndex, 1);
        component.tableCommitGroup(cell.groupIdx);

        // add to target cell
        const dstList = component.tableCellList(component.groups[targetGroupIdx], targetColIdx);
        dstList.push(tile);
        component.tableCommitGroup(targetGroupIdx);

        this.selectMoveItemValidatedKey(component, event, tile);
    }

    /** Table mode: move the selected tile to the first/last row or column (keeping the other axis). */
    private moveTableCellEdge(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        axis: 'row' | 'col',
        edge: 'first' | 'last',
    ) {
        const cell = component.tableFindCell(component.selectionTile);
        if (!cell) {
            this.stopEvent(event);
            return;
        }
        const colCount = component.options.col?.length ?? 1;
        const rowCount = component.groups.length;

        let targetGroupIdx = cell.groupIdx;
        let targetColIdx = cell.colIdx;
        if (axis === 'row') {
            targetGroupIdx = edge === 'first' ? 0 : rowCount - 1;
        } else {
            targetColIdx = edge === 'first' ? 0 : colCount - 1;
        }
        this.moveTableCellTo(component, event, cell, targetGroupIdx, targetColIdx);
    }

    /** Table mode: move a tile from the main list into the last row, first column. */
    private moveTableFromMainList(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        group: FileType[],
        index: number,
    ) {
        const rowCount = component.groups.length;
        if (rowCount === 0) {
            this.stopEvent(event);
            return;
        }

        const targetGroupIdx = rowCount - 1;
        const targetColIdx = 0;

        const tile = group.splice(index, 1)[0];
        const dstList = component.tableCellList(component.groups[targetGroupIdx], targetColIdx);
        dstList.push(tile);
        component.tableCommitGroup(targetGroupIdx);

        this.selectMoveItemValidatedKey(component, event, tile);
    }

    /**
     * Table mode: move the selected tile within its cell to an absolute position.
     * Stays bounded — does not overflow to adjacent cells.
     * For relative moves (±1), pass index + direction as targetIndex.
     */
    private moveTableInCell(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        cellList: FileType[],
        index: number,
        targetIndex: number,
    ) {
        const clamped = Math.max(0, Math.min(targetIndex, cellList.length - 1));
        if (clamped === index) {
            this.stopEvent(event);
            return;
        }

        const tile = cellList.splice(index, 1)[0];
        cellList.splice(clamped, 0, tile);

        const cell = component.tableFindCell(tile);
        if (cell) {
            component.tableCommitGroup(cell.groupIdx);
        }

        // After re-render, find the tile's focusable div by its id.
        this.selectMoveItemValidatedKey(component, event, tile, () => {
            const el = document.getElementById(tile!.id);
            return el?.closest<HTMLDivElement>('.click-enter') ?? (el?.parentElement as HTMLDivElement | null);
        });
    }

    private moveLeft(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        group: FileType[],
        index: number,
        indexGp: number,
        limit: boolean = false,
    ) {
        if (index > 0) {
            this.moveInset(component, event, group, group.splice(index, 1)[0], limit ? 0 : index - 1, indexGp);
        }
    }

    private moveLeftZone(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        group: FileType[],
        index: number,
        step: number,
    ) {
        if (group[index] && component.selectionDrag) {
            group[index].x = Math.max((group[index].x ?? 0) - step, 0);
            this.updatePos(component, group[index]);
            this.selectMoveItemValidatedKey(
                component,
                event,
                group[index],
                component.selectionDiv?.id !== group[index]?.id
                    ? (document.getElementById(group[index].id)!.parentElement as HTMLDivElement)
                    : undefined,
            );
        }
    }

    private moveRight(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        group: FileType[],
        index: number,
        indexGp: number,
        limit: boolean = false,
    ) {
        if (index < group.length) {
            this.moveInset(
                component,
                event,
                group,
                group.splice(index, 1)[0],
                limit ? group.length : index + 1,
                indexGp,
            );
        }
    }

    private moveInset(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        group: FileType[],
        tile: FileType,
        indexPos: number,
        indexGp: number,
    ) {
        group.splice(indexPos, 0, tile);
        this.selectMoveItemValidatedKey(component, event, tile, this.getTarget(component, group, indexPos, indexGp));
    }

    private getTarget(component: ClassementEditComponent, group: FileType[], indexPos: number, indexGp: number) {
        let target: HTMLDivElement | string | null = null;
        if (component.options.mode === 'bingo' && indexGp !== -1) {
            target = `tr:nth-child(${indexGp + 1}) > td:nth-child(${indexPos + 1}) > div`;
        } else if (group[indexPos] && component.selectionDiv?.id !== group[indexPos]?.id) {
            target = document.getElementById(group[indexPos]!.id) as HTMLDivElement;
            if (!target.classList.contains('click-enter')) {
                target = target.parentElement as HTMLDivElement;
            }
        }
        return target;
    }

    private moveRightZone(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        group: FileType[],
        index: number,
        step: number,
    ) {
        if (group[index] && component.selectionDrag) {
            const rect = document.getElementById('zone')!.getBoundingClientRect();
            const rctItem = document.getElementById(group[index].id)!.parentElement!.getBoundingClientRect();
            group[index].x = Math.min((group[index].x ?? 0) + step, rect.width - rctItem.width);
            this.updatePos(component, group[index]);
            this.selectMoveItemValidatedKey(
                component,
                event,
                group[index],
                component.selectionDiv?.id !== group[index]?.id
                    ? (document.getElementById(group[index].id)!.parentElement as HTMLDivElement)
                    : undefined,
            );
        }
    }

    private moveUp(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        group: FileType[],
        index: number,
        indexGp: number,
    ) {
        if (indexGp) {
            const mode = component.options.mode;
            let tile: FileType;
            let i = indexGp === -1 ? (mode === 'columns' ? 0 : component.groups.length - 1) : indexGp - 1;
            let targetList = component.groups[i].list;
            let target: HTMLDivElement | string | null = null;

            if (mode === 'teams') {
                tile = group[index];
                while (targetList?.find(targetTile => targetTile?.id === tile!.id)) {
                    targetList = component.groups[--i]?.list;
                }
                if (!targetList) {
                    this.stopEvent(event);
                    return;
                } else if (indexGp !== -1) {
                    tile = group.splice(index, 1)[0];
                }
                targetList.push(tile);
            } else {
                tile = group.splice(index, 1)[0];
                targetList.push(tile);

                if ((mode === 'iceberg' || mode === 'axis') && tile) {
                    tile.x = 0;
                    tile.y = 0;
                    setTimeout(() => {
                        target = this.getTarget(component, targetList, targetList.length - 1, indexGp);
                        this.updatePos(component, targetList[targetList.length - 1]);
                    });
                }
            }
            this.selectMoveItemValidatedKey(component, event, tile, target);
        } else {
            this.stopEvent(event);
        }
    }

    private moveUpZone(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        group: FileType[],
        index: number,
        step: number,
    ) {
        if (group[index] && component.selectionDrag) {
            group[index].y = Math.max((group[index].y ?? 0) - step, 0);
            this.updatePos(component, group[index]);
            this.selectMoveItemValidatedKey(
                component,
                event,
                group[index],
                component.selectionDiv?.id !== group[index]?.id
                    ? (document.getElementById(group[index].id)!.parentElement as HTMLDivElement)
                    : undefined,
            );
        }
    }

    private moveUpBingo(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        group: FileType[],
        index: number,
        indexGp: number,
    ) {
        if (indexGp === -1) {
            for (let i = component.groups.length - 1; i >= 0; i--) {
                for (let j = component.groups[i].list.length - 1; j >= 0; j--) {
                    if (component.groups[i].list[j] === null) {
                        const tile = group.splice(index, 1)[0];
                        component.groups[i].list[j] = tile;
                        this.selectMoveItemValidatedKey(component, event, tile);
                        return;
                    }
                }
            }
        } else if (indexGp) {
            const tile = group[index];
            const i = indexGp - 1;
            const targetList = component.groups[i].list;

            group.splice(index, 0, targetList.splice(index, 1, group.splice(index, 1)[0])[0])[0];

            this.selectMoveItemValidatedKey(
                component,
                event,
                tile,
                `tr:nth-child(${indexGp}) > td:nth-child(${index + 1}) > div`,
            );
        }
        this.stopEvent(event);
    }

    private moveDown(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        group: FileType[],
        index: number,
        indexGp: number,
    ) {
        if (indexGp < component.groups.length - 1 && indexGp !== -1) {
            const tile = group[index];
            let i = indexGp + 1;
            let targetList = component.groups[i].list;
            if (component.options.mode === 'teams') {
                while (targetList?.find(targetTile => targetTile?.id === tile!.id)) {
                    targetList = component.groups[++i]?.list;
                }
                if (!targetList) {
                    this.stopEvent(event);
                    return;
                }
            }
            group.splice(index, 1)[0];
            targetList.push(tile);

            this.selectMoveItemValidatedKey(component, event, tile);
        } else {
            this.stopEvent(event);
        }
    }

    private moveDownZone(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        group: FileType[],
        index: number,
        step: number,
    ) {
        if (group[index]) {
            const rect = document.getElementById('zone')!.getBoundingClientRect();
            const rctItem = document.getElementById(group[index].id)!.parentElement!.getBoundingClientRect();
            group[index].y = Math.min((group[index].y ?? 0) + step, rect.height - rctItem.height);
            this.updatePos(component, group[index]);
            this.selectMoveItemValidatedKey(
                component,
                event,
                group[index],
                component.selectionDiv?.id !== group[index]?.id
                    ? (document.getElementById(group[index].id) as HTMLDivElement)
                    : undefined,
            );
        }
    }

    private moveDownBingo(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        group: FileType[],
        index: number,
        indexGp: number,
    ) {
        if (indexGp < component.groups.length - 1 && indexGp !== -1) {
            const tile = group[index];
            const i = indexGp + 1;
            const targetList = component.groups[i].list;

            group.splice(index, 0, targetList.splice(index, 1, group.splice(index, 1)[0])[0])[0];

            this.selectMoveItemValidatedKey(
                component,
                event,
                tile,
                `tr:nth-child(${indexGp + 2}) > td:nth-child(${index + 1}) > div`,
            );
        } else {
            this.stopEvent(event);
        }
    }

    private updatePos(component: ClassementEditComponent, item: FileType) {
        component.initItem(component.selectionDrag!, { x: item!.x!, y: item!.y! });
    }

    private selectMoveItemValidatedKey(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        tile: FileType,
        target?: HTMLDivElement | string | (() => HTMLDivElement | null) | null,
    ) {
        component.selectionTile = tile;
        component.stopEvent(event);
        component.detectChanges();

        setTimeout(() => {
            let div: HTMLDivElement | null;
            if (typeof target === 'function') {
                div = target();
            } else {
                div =
                    (typeof target === 'string' ? document.querySelector<HTMLDivElement>(target) : target) ??
                    component.selectionDiv;
            }
            div?.focus();
            div?.scrollIntoView({ block: 'center' });
            component.globalChange();
        });
    }

    selectItem(
        component: ClassementEditComponent,
        event: KeyboardEvent | MouseEvent | null = null,
        group: FormattedGroup | null = null,
        item: FileType = null,
        index: number | null = null,
        div: HTMLDivElement | null = null,
    ) {
        component.selectionTile = item;
        component.selectionGroup = group;
        component.selectionIndex = index;
        this.update(component, group?.list);
        div?.focus();
        event?.stopPropagation();
    }

    selectItemByKey(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        group: FormattedGroup | null,
        item: FileType,
        index: number | null = null,
        drag: CdkDragElement | null = null,
    ) {
        switch (event.key) {
            case 'e':
                // edit tile
                if (item) {
                    component.openTileInfo(item);
                }
                break;
            case 'Escape':
                this.clearSelection(component);
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowDown':
            case 'Home':
            case 'End':
            case 'PageUp':
            case 'PageDown':
                if (
                    event.ctrlKey ||
                    // table edge moves use Alt (Ctrl+Shift is hijacked by the browser)
                    (component.options.mode === 'table' && event.altKey && jumpKeys.includes(event.key))
                ) {
                    component.selectionTile = item;
                    component.selectionGroup = group;
                    component.selectionIndex = index;
                    component.selectionDrag = drag;
                    this.update(component, group?.list);
                    // preventDefault blocks the browser's native Ctrl+Arrow behavior (word jump,
                    // focus move) without stopping propagation — selectMoveItem still fires on
                    // the parent drop-list via bubbling.
                    event.preventDefault();
                } else {
                    // navigate between tile with keyboard
                    this.navigateFocus(component, event, group, index, item);
                }
                break;
            case 'Delete':
                if (event.ctrlKey && group && index) {
                    // move tile form group at list
                    component.removeFromGroup(group.list, index);
                    this.clearSelection(component);
                    this.stopEvent(event);
                } else if (!group && index) {
                    // delete tile in list
                    component.removeItem(index);
                    this.clearSelection(component);
                    this.stopEvent(event);
                }
                break;
        }
    }

    private update(component: ClassementEditComponent, group?: FileType[]) {
        this.selectTile.set(component.selectionTile !== null);
        this.selectMainLine.set(component.groups.findIndex(e => e.list === group) === -1);
    }

    initSelectedItem(component: ClassementEditComponent, div: HTMLDivElement, item: FileType) {
        if (item?.id && item?.id === component.selectionTile?.id) {
            div.focus();
        }
    }

    selectionGroupForItem(
        component: ClassementEditComponent,
        group: FormattedGroup | null,
        indexTarget: number | null = null,
    ) {
        switch (component.options.mode) {
            case 'default':
            case 'columns':
                if (component.selectionTile && group) {
                    const originList = component.selectionGroup?.list ?? component.list;
                    const index = originList.indexOf(component.selectionTile);
                    group.list.push(...originList.splice(index, 1));
                    this.clearSelection(component);
                }
                break;
            case 'teams':
                if (component.selectionTile && group) {
                    if (component.selectionGroup) {
                        const index = component.selectionGroup.list.indexOf(component.selectionTile);
                        if (!group.list.find(tile => tile!.id === component.selectionTile!.id)) {
                            group.list.push(...component.selectionGroup.list.splice(index, 1));
                        } else {
                            component.selectionGroup.list.splice(index, 1);
                        }
                        this.clearSelection(component);
                    } else if (!group.list.find(tile => tile!.id === component.selectionTile!.id)) {
                        group.list.push(component.selectionTile);
                        this.clearSelection(component);
                    }
                }
                break;
            case 'bingo':
                if (component.selectionTile && group) {
                    const originList = component.selectionGroup?.list ?? component.list;
                    const index = originList.indexOf(component.selectionTile);
                    const back = group.list[indexTarget!];

                    if (component.selectionGroup) {
                        // from group
                        group.list[indexTarget!] = originList[index];
                        originList[index] = back;
                    } else {
                        // from list
                        group.list[indexTarget!] = originList.splice(index, 1)[0];
                        if (back) {
                            component.list.push(back);
                        }
                    }
                    this.clearSelection(component);
                    const id = group.list[indexTarget!]?.id;

                    if (id) {
                        setTimeout(() => {
                            document.getElementById(id)?.parentElement?.parentElement?.focus();
                        });
                    }
                }
                break;
        }
    }

    private navigateFocus(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        group: FormattedGroup | null,
        index: number | null,
        item: FileType = null,
    ) {
        if (index === null) {
            return;
        }

        const indexGp = group ? component.groups.indexOf(group) : -1;

        let key = event.key;

        if (component.options.direction === 'rtl') {
            switch (key) {
                case 'ArrowLeft':
                    key = 'ArrowRight';
                    break;
                case 'ArrowRight':
                    key = 'ArrowLeft';
                    break;
            }
        }

        // Table mode uses cell-aware navigation with wrap-around between cells,
        // which does not share the generic row/list logic below.
        if (component.options.mode === 'table') {
            const currentTile = item ?? component.selectionTile;
            const cellFound = currentTile ? component.tableFindCell(currentTile) : null;
            if (cellFound) {
                // tile is inside a table cell → use cell-aware navigation
                this.navigateFocusTable(component, event, key, currentTile!);
                return;
            }
            // tile is in the main list → fall through to generic navigation
        }

        this.navigateFocusGeneric(component, event, key, group, index, indexGp);
    }

    private navigateFocusGeneric(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        key: string,
        group: FormattedGroup | null,
        index: number,
        indexGp: number,
    ) {
        const currentList = group ? group.list : component.list;
        const firstNonEmptyGp = component.groups.findIndex(g => g.list.some(t => t !== undefined));
        const lastNonEmptyGp = component.groups.reduce(
            (last, g, i) => (g.list.some(t => t !== undefined) ? i : last),
            -1,
        );

        let targetList: FileType[] | null = null;
        let targetIndex = index;

        if (indexGp !== -1) {
            switch (component.options.mode) {
                case 'columns':
                    switch (key) {
                        case 'ArrowLeft':
                            key = 'ArrowUp';
                            break;
                        case 'ArrowRight':
                            key = 'ArrowDown';
                            break;
                        case 'ArrowUp':
                            key = 'ArrowLeft';
                            break;
                        case 'ArrowDown':
                            key = 'ArrowRight';
                            break;
                        case 'Home':
                            key = 'PageUp';
                            break;
                        case 'End':
                            key = 'PageDown';
                            break;
                        case 'PageUp':
                            key = 'Home';
                            break;
                        case 'PageDown':
                            key = 'End';
                            break;
                    }
                    break;
                case 'bingo':
                case 'axis':
                    switch (key) {
                        case 'ArrowUp':
                            key = 'ArrowLeft';
                            break;
                        case 'PageUp':
                            key = 'Home';
                            break;
                        case 'PageDown':
                            key = 'End';
                            break;
                    }
                    break;
            }
        }

        switch (key) {
            case 'ArrowLeft':
                if (index > 0) {
                    ({ targetList, targetIndex } = this.focusListPrev(currentList, index));
                }
                break;
            case 'ArrowRight':
                if (index < currentList.length - 1) {
                    ({ targetList, targetIndex } = this.focusListNext(currentList, index));
                }
                break;
            case 'ArrowUp':
                if (indexGp > firstNonEmptyGp) {
                    targetList = this.focusRowPrev(component, indexGp);
                } else if (indexGp === -1 && lastNonEmptyGp !== -1) {
                    targetList = this.focusRowLast(component, lastNonEmptyGp);
                }

                if (targetList) {
                    targetIndex = targetList[index] !== undefined ? index : 0;
                }

                break;
            case 'ArrowDown':
                if (indexGp === lastNonEmptyGp) {
                    targetList = component.list;
                } else if (indexGp <= lastNonEmptyGp && indexGp !== -1) {
                    targetList = this.focusRowNext(component, indexGp);
                    targetIndex = targetList[index] !== undefined ? index : 0;
                }
                break;
            case 'Home':
                targetList = currentList;
                targetIndex = 0;
                break;
            case 'End':
                targetList = currentList;
                targetIndex = currentList.length - 1;
                break;
            case 'PageUp': {
                if (indexGp === -1) {
                    targetList = this.focusRowLast(component, lastNonEmptyGp);
                } else if (indexGp !== firstNonEmptyGp) {
                    targetList = this.focusRowFirst(component, firstNonEmptyGp);
                }
                break;
            }
            case 'PageDown': {
                if (indexGp === lastNonEmptyGp) {
                    targetList = component.list;
                } else if (indexGp !== -1) {
                    targetList = this.focusRowLast(component, lastNonEmptyGp);
                }
                break;
            }
        }

        if (!targetList) {
            this.stopEvent(event);
            return;
        }

        // clamp index to target list bounds
        targetIndex = Math.max(0, Math.min(targetIndex, targetList.length - 1));
        const targetTile = targetList[targetIndex];
        if (targetTile === undefined) {
            this.stopEvent(event);
            return;
        }

        let el;
        if (targetTile !== null) {
            el = document.getElementById(targetTile.id);
        }
        if (component.options.mode === 'bingo' && !el && targetList) {
            const indexList = component.groups.findIndex(g => g.list === targetList);
            el = document.querySelector(
                `.table-classement tr:nth-child(${indexList + 1}) > td:nth-child(${targetIndex + 1}) > div`,
            );
        }
        const div = el?.closest<HTMLDivElement>('.click-enter') ?? (el?.parentElement as HTMLDivElement | null);
        div?.focus();
        div?.scrollIntoView({ block: 'nearest' });
        this.stopEvent(event);
    }

    private navigateFocusTable(component: ClassementEditComponent, event: KeyboardEvent, key: string, tile: FileType) {
        const cell = component.tableFindCell(tile);
        if (!cell) {
            this.stopEvent(event);
            return;
        }

        const colCount = component.options.col?.length ?? 1;
        const rowCount = component.groups.length;
        const { groupIdx, colIdx } = cell;

        const cellList = component.tableCellList(component.groups[groupIdx], colIdx);
        const posInCell = cellList.indexOf(tile as NonNullable<FileType>);

        let targetGroupIdx = groupIdx;
        let targetColIdx = colIdx;
        let targetPosInCell = posInCell;

        switch (key) {
            case 'ArrowRight': {
                if (posInCell < cellList.length - 1) {
                    targetPosInCell = posInCell + 1;
                } else if (event.shiftKey) {
                    // Shift+→ : linear wrap across cells and rows
                    const next = this.findNextNonEmptyCell(component, groupIdx, colIdx, colCount, rowCount);
                    if (!next) {
                        this.stopEvent(event);
                        return;
                    }
                    ({ groupIdx: targetGroupIdx, colIdx: targetColIdx, posInCell: targetPosInCell } = next);
                } else if (colIdx < colCount - 1) {
                    const next = this.findNextNonEmptyCellInRow(component, groupIdx, colIdx, colCount);
                    if (!next) {
                        this.stopEvent(event);
                        return;
                    }
                    ({ groupIdx: targetGroupIdx, colIdx: targetColIdx, posInCell: targetPosInCell } = next);
                } else {
                    this.stopEvent(event);
                    return;
                }
                break;
            }
            case 'ArrowLeft': {
                if (posInCell > 0) {
                    targetPosInCell = posInCell - 1;
                } else if (event.shiftKey) {
                    // Shift+← : linear wrap across cells and rows
                    const prev = this.findPrevNonEmptyCell(component, groupIdx, colIdx, colCount);
                    if (!prev) {
                        this.stopEvent(event);
                        return;
                    }
                    ({ groupIdx: targetGroupIdx, colIdx: targetColIdx, posInCell: targetPosInCell } = prev);
                } else if (colIdx > 0) {
                    const prev = this.findPrevNonEmptyCellInRow(component, groupIdx, colIdx);
                    if (!prev) {
                        this.stopEvent(event);
                        return;
                    }
                    ({ groupIdx: targetGroupIdx, colIdx: targetColIdx, posInCell: targetPosInCell } = prev);
                } else {
                    this.stopEvent(event);
                    return;
                }
                break;
            }
            case 'ArrowDown': {
                // next non-empty cell in the same column, searching downward
                const next = this.findNextNonEmptyCellInCol(component, groupIdx, colIdx, rowCount);
                if (!next) {
                    this.stopEvent(event);
                    return;
                }
                ({ groupIdx: targetGroupIdx, colIdx: targetColIdx, posInCell: targetPosInCell } = next);
                break;
            }
            case 'ArrowUp': {
                // previous non-empty cell in the same column, searching upward
                const prev = this.findPrevNonEmptyCellInCol(component, groupIdx, colIdx);
                if (!prev) {
                    this.stopEvent(event);
                    return;
                }
                ({ groupIdx: targetGroupIdx, colIdx: targetColIdx, posInCell: targetPosInCell } = prev);
                break;
            }
            case 'Home':
                targetPosInCell = 0;
                break;
            case 'End':
                targetPosInCell = Math.max(0, cellList.length - 1);
                break;
            case 'PageUp':
                targetGroupIdx = 0;
                targetPosInCell = 0;
                break;
            case 'PageDown':
                targetGroupIdx = rowCount - 1;
                targetPosInCell = 0;
                break;
            default:
                this.stopEvent(event);
                return;
        }

        const targetCellList = component.tableCellList(component.groups[targetGroupIdx], targetColIdx);
        const clampedPos = Math.max(0, Math.min(targetPosInCell, targetCellList.length - 1));
        const targetTile = targetCellList[clampedPos];

        if (!targetTile) {
            this.stopEvent(event);
            return;
        }

        const el = document.getElementById(targetTile.id);
        const div = el?.closest<HTMLDivElement>('.click-enter') ?? (el?.parentElement as HTMLDivElement | null);
        div?.focus();
        div?.scrollIntoView({ block: 'nearest' });
        this.stopEvent(event);
    }

    /** Next non-empty cell in linear order (left-to-right, top-to-bottom), skipping empty ones. */
    private findNextNonEmptyCell(
        component: ClassementEditComponent,
        groupIdx: number,
        colIdx: number,
        colCount: number,
        rowCount: number,
    ): { groupIdx: number; colIdx: number; posInCell: number } | null {
        let g = groupIdx;
        let c = colIdx + 1;
        while (g < rowCount) {
            while (c < colCount) {
                const list = component.tableCellList(component.groups[g], c);
                if (list.length > 0) {
                    return { groupIdx: g, colIdx: c, posInCell: 0 };
                }
                c++;
            }
            g++;
            c = 0;
        }
        return null;
    }

    /** Previous non-empty cell in linear order (right-to-left, bottom-to-top), skipping empty ones. */
    private findPrevNonEmptyCell(
        component: ClassementEditComponent,
        groupIdx: number,
        colIdx: number,
        colCount: number,
    ): { groupIdx: number; colIdx: number; posInCell: number } | null {
        let g = groupIdx;
        let c = colIdx - 1;
        while (g >= 0) {
            while (c >= 0) {
                const list = component.tableCellList(component.groups[g], c);
                if (list.length > 0) {
                    return { groupIdx: g, colIdx: c, posInCell: list.length - 1 };
                }
                c--;
            }
            g--;
            c = colCount - 1;
        }
        return null;
    }

    /** Next non-empty cell in the same row, searching rightward. */
    private findNextNonEmptyCellInRow(
        component: ClassementEditComponent,
        groupIdx: number,
        colIdx: number,
        colCount: number,
    ): { groupIdx: number; colIdx: number; posInCell: number } | null {
        for (let c = colIdx + 1; c < colCount; c++) {
            const list = component.tableCellList(component.groups[groupIdx], c);
            if (list.length > 0) {
                return { groupIdx, colIdx: c, posInCell: 0 };
            }
        }
        return null;
    }

    /** Previous non-empty cell in the same row, searching leftward. */
    private findPrevNonEmptyCellInRow(
        component: ClassementEditComponent,
        groupIdx: number,
        colIdx: number,
    ): { groupIdx: number; colIdx: number; posInCell: number } | null {
        for (let c = colIdx - 1; c >= 0; c--) {
            const list = component.tableCellList(component.groups[groupIdx], c);
            if (list.length > 0) {
                return { groupIdx, colIdx: c, posInCell: list.length - 1 };
            }
        }
        return null;
    }

    /** Next non-empty cell in the same column, searching downward. */
    private findNextNonEmptyCellInCol(
        component: ClassementEditComponent,
        groupIdx: number,
        colIdx: number,
        rowCount: number,
    ): { groupIdx: number; colIdx: number; posInCell: number } | null {
        for (let g = groupIdx + 1; g < rowCount; g++) {
            const list = component.tableCellList(component.groups[g], colIdx);
            if (list.length > 0) {
                return { groupIdx: g, colIdx, posInCell: 0 };
            }
        }
        return null;
    }

    /** Previous non-empty cell in the same column, searching upward. */
    private findPrevNonEmptyCellInCol(
        component: ClassementEditComponent,
        groupIdx: number,
        colIdx: number,
    ): { groupIdx: number; colIdx: number; posInCell: number } | null {
        for (let g = groupIdx - 1; g >= 0; g--) {
            const list = component.tableCellList(component.groups[g], colIdx);
            if (list.length > 0) {
                return { groupIdx: g, colIdx, posInCell: 0 };
            }
        }
        return null;
    }

    private focusListPrev(currentList: FileType[], index: number) {
        const prevIdx = currentList.slice(0, index).findLastIndex(t => t !== undefined);
        return {
            targetList: currentList,
            targetIndex: prevIdx,
        };
    }

    private focusListNext(currentList: FileType[], index: number) {
        const nextIdx = currentList.slice(index + 1).findIndex(t => t !== undefined) + 1 + index;
        return {
            targetList: currentList,
            targetIndex: nextIdx,
        };
    }

    private focusRowPrev(component: ClassementEditComponent, indexGp: number) {
        const prevIdx = component.groups.slice(0, indexGp).findLastIndex(g => g.list.some(t => t !== undefined));
        return component.groups[prevIdx].list;
    }

    private focusRowNext(component: ClassementEditComponent, indexGp: number) {
        const nextIdx =
            component.groups.slice(indexGp + 1).findIndex(g => g.list.some(t => t !== undefined)) + 1 + indexGp;
        return component.groups[nextIdx].list;
    }

    private focusRowFirst(component: ClassementEditComponent, firstNonEmptyGp: number) {
        return component.groups[firstNonEmptyGp].list;
    }
    private focusRowLast(component: ClassementEditComponent, lastNonEmptyGp: number) {
        return component.groups[lastNonEmptyGp].list;
    }

    clearSelection(component: ClassementEditComponent) {
        component.selectionTile = null;
        component.selectionGroup = null;
        component.selectionIndex = null;
        component.selectionDiv = null;
        component.globalChange();
        component.change();
        this.update(component);
    }

    stopEvent(event: Event) {
        if ((event instanceof MouseEvent && event.button === 1) || event instanceof KeyboardEvent) {
            // prevent copy on Linux
            event.stopPropagation();
            event.preventDefault();
        }
    }
}
