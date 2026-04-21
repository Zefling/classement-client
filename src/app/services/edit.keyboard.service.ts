import { Injectable, signal } from '@angular/core';

import { FileType, FormattedGroup } from 'src/app/interface/interface';

import { ClassementEditComponent } from '../content/classement/classement-edit.component';
import { CdkDragElement } from '../directives/drag-element.directive';

@Injectable({ providedIn: 'root' })
export abstract class EditKeyBoardService {
    readonly selectTile = signal(false);
    readonly selectMainLine = signal(false);

    selectMoveItem(component: ClassementEditComponent, event: KeyboardEvent, group: FileType[]) {
        const index = group.indexOf(component.selectionTile);
        const indexGp = component.groups.findIndex(e => e.list === group);

        if (index !== undefined && index !== -1) {
            if (event.ctrlKey) {
                switch (event.key) {
                    case 'ArrowLeft':
                        if (
                            (component.options.mode === 'axis' || component.options.mode === 'iceberg') &&
                            indexGp !== -1
                        ) {
                            this.moveLeftZone(component, event, group, index, event.shiftKey ? 1 : 15);
                        } else if (component.options.mode === 'columns' && indexGp !== -1) {
                            this.moveUp(component, event, group, index, indexGp);
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
                        } else {
                            this.moveUp(component, event, group, index, indexGp);
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
                        } else {
                            this.moveDown(component, event, group, index, indexGp);
                        }
                        break;
                    case 'Home':
                        this.moveLeft(component, event, group, index, indexGp, true);
                        break;
                    case 'End':
                        this.moveRight(component, event, group, index, indexGp, true);
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
        } else if (component.selectionDiv?.id !== group[indexPos]?.id) {
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
        target?: HTMLDivElement | string | null,
    ) {
        component.selectionTile = tile;
        component.stopEvent(event);
        component.detectorChanges();

        setTimeout(() => {
            const div =
                (typeof target === 'string' ? document.querySelector<HTMLDivElement>(target) : target) ??
                component.selectionDiv;
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
        drag: CdkDragElement<any> | null = null,
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
                if (event.ctrlKey) {
                    component.selectionTile = item;
                    component.selectionGroup = group;
                    component.selectionIndex = index;
                    component.selectionDrag = drag;
                    this.update(component, group?.list);
                } else {
                    // navigate between tile with keyboard
                    this.navigateFocus(component, event, group, index);
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
    ) {
        if (index === null) {
            return;
        }

        const currentList = group ? group.list : component.list;
        const indexGp = group ? component.groups.indexOf(group) : -1;
        const firstNonEmptyGp = component.groups.findIndex(g => g.list.some(t => t !== undefined));
        const lastNonEmptyGp = component.groups.reduce(
            (last, g, i) => (g.list.some(t => t !== undefined) ? i : last),
            -1,
        );

        let targetList: FileType[] | null = null;
        let targetIndex = index;
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
            return;
        }

        // clamp index to target list bounds
        targetIndex = Math.max(0, Math.min(targetIndex, targetList.length - 1));
        const targetTile = targetList[targetIndex];
        if (targetTile === undefined) {
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
