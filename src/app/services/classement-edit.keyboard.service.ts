import { Injectable, signal } from '@angular/core';

import { FileType, FormattedGroup } from 'src/app/interface/interface';

import { ClassementEditComponent } from '../content/classement/classement-edit.component';

@Injectable({ providedIn: 'root' })
export abstract class ClassementEditKeyBoardService {
    readonly selectTile = signal(false);
    readonly selectMainLine = signal(false);

    selectMoveItem(component: ClassementEditComponent, event: KeyboardEvent, group: FileType[]) {
        const index = group.indexOf(component.selectionTile);
        const indexGp = component.groups.findIndex(e => e.list === group);

        if (index !== undefined && index !== -1 && event.ctrlKey) {
            switch (event.key) {
                case 'ArrowLeft':
                    if (component.options.mode === 'columns' && indexGp !== -1) {
                        this.moveUp(component, event, group, index, indexGp);
                    } else {
                        this.moveLeft(component, event, group, index, indexGp);
                    }
                    break;
                case 'ArrowRight':
                    if (component.options.mode === 'columns' && indexGp !== -1) {
                        this.moveDown(component, event, group, index, indexGp);
                    } else {
                        this.moveRight(component, event, group, index, indexGp);
                    }
                    break;
                case 'ArrowUp':
                    if (component.options.mode === 'bingo') {
                        this.moveUpBingo(component, event, group, index, indexGp);
                    } else if (component.options.mode === 'columns' && indexGp !== -1) {
                        this.moveLeft(component, event, group, index, indexGp);
                    } else {
                        this.moveUp(component, event, group, index, indexGp);
                    }
                    break;
                case 'ArrowDown':
                    if (component.options.mode === 'bingo' && indexGp !== -1) {
                        this.moveDownBingo(component, event, group, index, indexGp);
                    } else if (component.options.mode === 'columns' && indexGp !== -1) {
                        this.moveRight(component, event, group, index, indexGp);
                    } else {
                        this.moveDown(component, event, group, index, indexGp);
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
    ) {
        if (index > 0) {
            const tile = group.splice(index, 1)[0];
            group.splice(index - 1, 0, tile);
            this.selectMoveItemValidatedKey(
                component,
                event,
                tile,
                component.options.mode === 'bingo'
                    ? `tr:nth-child(${indexGp + 1}) > td:nth-child(${index}) > div`
                    : null,
            );
        }
    }

    private moveRight(
        component: ClassementEditComponent,
        event: KeyboardEvent,
        group: FileType[],
        index: number,
        indexGp: number,
    ) {
        if (index < group.length) {
            const tile = group.splice(index, 1)[0];
            group.splice(index + 1, 0, tile);
            this.selectMoveItemValidatedKey(
                component,
                event,
                tile,
                component.options.mode === 'bingo'
                    ? `tr:nth-child(${indexGp + 1}) > td:nth-child(${index + 2}) > div`
                    : null,
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
            let tile: FileType;
            let i =
                indexGp === -1 ? (component.options.mode === 'columns' ? 0 : component.groups.length - 1) : indexGp - 1;
            let targetList = component.groups[i].list;
            if (component.options.mode === 'teams') {
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
            }
            this.selectMoveItemValidatedKey(component, event, tile);
        } else {
            this.stopEvent(event);
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
            (
                (typeof target === 'string' ? document.querySelector<HTMLDivElement>(target) : target) ??
                component.selectionDiv
            )?.focus();
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
        div: HTMLDivElement,
        index: number | null = null,
    ) {
        switch (event.key) {
            case 'Tab':
                this.clearSelection(component);
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowDown':
                if (event.ctrlKey) {
                    component.selectionTile = item;
                    component.selectionGroup = group;
                    component.selectionIndex = index;
                    this.update(component, group?.list);
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
