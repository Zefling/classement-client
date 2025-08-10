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

        if (index !== undefined && index !== -1 && event.ctrlKey) {
            switch (event.key) {
                case 'ArrowLeft':
                    if ((component.options.mode === 'axis' || component.options.mode === 'iceberg') && indexGp !== -1) {
                        this.moveLeftZone(component, event, group, index, event.shiftKey ? 1 : 15);
                    } else if (component.options.mode === 'columns' && indexGp !== -1) {
                        this.moveUp(component, event, group, index, indexGp);
                    } else {
                        this.moveLeft(component, event, group, index, indexGp);
                    }
                    break;
                case 'ArrowRight':
                    if ((component.options.mode === 'axis' || component.options.mode === 'iceberg') && indexGp !== -1) {
                        this.moveRightZone(component, event, group, index, event.shiftKey ? 1 : 15);
                    } else if (component.options.mode === 'columns' && indexGp !== -1) {
                        this.moveDown(component, event, group, index, indexGp);
                    } else {
                        this.moveRight(component, event, group, index, indexGp);
                    }
                    break;
                case 'ArrowUp':
                    if ((component.options.mode === 'axis' || component.options.mode === 'iceberg') && indexGp !== -1) {
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
                    if ((component.options.mode === 'axis' || component.options.mode === 'iceberg') && indexGp !== -1) {
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
            this.clearSelection(component);
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
            case 'Escape':
                this.clearSelection(component);
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowDown':
            case 'Home':
            case 'End':
                if (event.ctrlKey) {
                    component.selectionTile = item;
                    component.selectionGroup = group;
                    component.selectionIndex = index;
                    component.selectionDrag = drag;
                    this.update(component, group?.list);
                }
                break;
            case 'Delete':
                if (event.ctrlKey && group && index) {
                    component.removeFromGroup(group.list, index);
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
                }
                break;
        }
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
