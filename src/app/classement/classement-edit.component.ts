import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

type Group = { name: string; color: string; list: string[] };

@Component({
    selector: 'classement-edit',
    templateUrl: './classement-edit.component.html',
    styleUrls: ['./classement-edit.component.scss'],
})
export class ClassementEditComponent {
    groups: Group[] = [
        { name: 'A', color: '#FFFFFF', list: [] },
        { name: 'B', color: '#FFFFFF', list: [] },
        { name: 'C', color: '#FFFFFF', list: [] },
        { name: 'D', color: '#FFFFFF', list: [] },
        { name: 'E', color: '#FFFFFF', list: [] },
    ];
    list: string[] = [
        'Element 1',
        'Element 2',
        'Element 3',
        'Element 4',
        'Element 5',
        'Element 6',
        'Element 7',
        'Element 8',
        'Element 9',
        'Element 10',
    ];

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
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
}
