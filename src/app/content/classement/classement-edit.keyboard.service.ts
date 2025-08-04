import { Injectable } from '@angular/core';

import { FileType, FormattedGroup } from 'src/app/interface/interface';

import { ClassementEditComponent } from './classement-edit.component';

@Injectable({ providedIn: 'root' })
export abstract class ClassementEditKeyBoardService {
    selectMoveItem(component: ClassementEditComponent, event: KeyboardEvent, group: FileType[]) {
        const index = group.indexOf(component.selectionTile);
        const indexGp = component.groups.findIndex(e => e.list === group);

        if (index !== undefined && index !== -1 && event.ctrlKey) {
            switch (event.key) {
                case 'ArrowLeft':
                    if (index > 0) {
                        const tile = group.splice(index, 1)[0];
                        group.splice(index - 1, 0, tile);
                        this.selectMoveItemValidatedKey(component, event, tile);
                    }
                    break;
                case 'ArrowRight':
                    if (index < group.length) {
                        const tile = group.splice(index, 1)[0];
                        group.splice(index + 1, 0, tile);
                        this.selectMoveItemValidatedKey(component, event, tile);
                    }
                    break;
                case 'ArrowUp':
                    if (indexGp) {
                        let tile: FileType;
                        let i =
                            indexGp === -1
                                ? component.options.mode === 'columns'
                                    ? 0
                                    : component.groups.length - 1
                                : indexGp - 1;
                        let targetList = component.groups[i].list;
                        if (component.options.mode === 'teams') {
                            tile = group[index];
                            while (targetList?.find(targetTile => targetTile?.id === tile!.id)) {
                                targetList = component.groups[--i]?.list;
                            }
                            if (!targetList) {
                                this.stopEvent(event);
                                break;
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
                    break;
                case 'ArrowDown':
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
                                break;
                            }
                        }
                        group.splice(index, 1)[0];
                        targetList.push(tile);

                        this.selectMoveItemValidatedKey(component, event, tile);
                    } else {
                        this.stopEvent(event);
                    }
                    break;
            }
        }
    }

    private selectMoveItemValidatedKey(component: ClassementEditComponent, event: KeyboardEvent, tile: FileType) {
        component.selectionTile = tile;
        component.stopEvent(event);
        component.cd.detectChanges();

        setTimeout(() => {
            component.selectionDiv?.focus();
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
                if (event.ctrlKey) {
                    component.selectionTile = item;
                    component.selectionGroup = group;
                    component.selectionIndex = index;
                    component.selectionDiv = div;
                }
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                if (event.ctrlKey) {
                    component.selectionTile = item;
                    component.selectionGroup = group;
                    component.selectionIndex = index;
                    component.selectionDiv = div;
                }
                break;
        }
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
        component.globalChange();
        component.change();
    }

    stopEvent(event: Event) {
        if ((event instanceof MouseEvent && event.button === 1) || event instanceof KeyboardEvent) {
            // prevent copy on Linux
            event.stopPropagation();
            event.preventDefault();
        }
    }
}
