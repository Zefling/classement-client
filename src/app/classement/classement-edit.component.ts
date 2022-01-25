import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
    selector: 'classement-edit',
    templateUrl: './classement-edit.component.html',
    styleUrls: ['./classement-edit.component.scss'],
})
export class ClassementEditComponent {
    groups: string[][] = [[]];
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

    up() {}

    down() {}

    suppr() {}

    ajout() {}
}
