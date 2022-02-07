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
        { name: 'S', color: '#dc8add', list: [] },
        { name: 'A', color: '#f66151', list: [] },
        { name: 'B', color: '#ffbe6f', list: [] },
        { name: 'C', color: '#f9f06b', list: [] },
        { name: 'D', color: '#8ff0a4', list: [] },
        { name: 'E', color: '#99c1f1', list: [] },
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
        'Element 11',
        'Element 12',
        'Element 13',
        'Element 14',
        'Element 15',
        'Element 16',
        'Element 17',
        'Element 18',
        'Element 19',
        'Element 20',
    ];

    drop(list: string[], event: CdkDragDrop<{ list: string[]; index: number }>) {
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
}
