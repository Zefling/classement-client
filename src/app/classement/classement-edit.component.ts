import { Component, HostBinding } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FileHandle } from '../directives/drop-image.directive';

type Group = { name: string; color: string; list: FileHandle[] };

@Component({
    selector: 'classement-edit',
    templateUrl: './classement-edit.component.html',
    styleUrls: ['./classement-edit.component.scss'],
})
export class ClassementEditComponent {
    groups: Group[] = [
        { name: 'S', color: '#dc8add', list: [] },
        { name: 'A', color: '#f66151', list: [] },
        { name: 'B', color: '#ffbe6f', list: [] },
        { name: 'C', color: '#f9f06b', list: [] },
        { name: 'D', color: '#8ff0a4', list: [] },
        { name: 'E', color: '#99c1f1', list: [] },
    ];
    list: FileHandle[] = [];

    @HostBinding('style.--item-width.px') itemWidth = 100;
    @HostBinding('style.--item-height.px') itemHeight = 100;
    @HostBinding('style.--item-padding.px') itemPadding = 10;

    drop(list: FileHandle[], event: CdkDragDrop<{ list: FileHandle[]; index: number }>) {
        const indexFrom = event.previousContainer.data.index;
        const indexTarget = event.container.data.index;
        if (event.previousContainer.data.list === event.container.data.list) {
            moveItemInArray(list, indexFrom, indexTarget);
        } else {
            transferArrayItem(
                event.previousContainer.data.list,
                event.container.data.list,
                indexFrom,
                indexTarget + event.currentIndex,
            );
        }
    }

    up(index: number) {
        this.groups.splice(index - 1, 0, this.groups.splice(index, 1)[0]);
    }

    down(index: number) {
        this.groups.splice(index + 1, 0, this.groups.splice(index, 1)[0]);
    }

    suppr(index: number) {
        this.list.push(...this.groups.splice(index, 1)[0].list);
    }

    ajout(index: number) {
        this.groups.splice(index + 1, 0, { name: 'nv', color: '#FFF', list: [] });
    }

    addFiles(files: FileHandle[]) {
        console.log('W>', files);
        this.list.push(...files);
    }
}
