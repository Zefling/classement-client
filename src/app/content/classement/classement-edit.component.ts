import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, HostBinding, ViewChild } from '@angular/core';

import { Coloration } from 'coloration-lib';
import html2canvas from 'html2canvas';

import { DialogComponent } from 'src/app/components/dialog.component';

import { FileHandle } from '../../directives/drop-image.directive';


type Group = { name: string; bgColor: string; txtColor: string; list: FileHandle[] };
type Category = { value: string; label: string };

@Component({
    selector: 'classement-edit',
    templateUrl: './classement-edit.component.html',
    styleUrls: ['./classement-edit.component.scss'],
})
export class ClassementEditComponent {
    groups: Group[] = [
        { name: 'S', bgColor: '#dc8add', txtColor: '#000000', list: [] },
        { name: 'A', bgColor: '#f66151', txtColor: '#000000', list: [] },
        { name: 'B', bgColor: '#ffbe6f', txtColor: '#000000', list: [] },
        { name: 'C', bgColor: '#f9f06b', txtColor: '#000000', list: [] },
        { name: 'D', bgColor: '#8ff0a4', txtColor: '#000000', list: [] },
        { name: 'E', bgColor: '#99c1f1', txtColor: '#000000', list: [] },
    ];
    list: FileHandle[] = [];

    categories: Category[] = [
        { value: 'anime', label: 'Anime' },
        { value: 'jv', label: 'Video Game' },
        { value: 'film', label: 'Movie' },
    ];

    title = '';
    category = '';
    @HostBinding('style.--item-width.px') itemWidth = 100;
    @HostBinding('style.--item-height.px') itemHeight = 100;
    @HostBinding('style.--item-padding.px') itemPadding = 10;

    @ViewChild('image') image!: ElementRef;
    @ViewChild(DialogComponent) dialog!: DialogComponent;

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

    remove(index: number) {
        this.list.splice(index, 1);
    }

    ajout(index: number) {
        const mixColor = (color1: string, color2: string) =>
            new Coloration(color1).addColor({ maskColor: color2, maskOpacity: 0.5 }).toHEX();
        const bgColor =
            index < this.groups.length - 1
                ? mixColor(this.groups[index].bgColor, this.groups[index + 1].bgColor)
                : this.groups[index].bgColor;
        const txtColor =
            index < this.groups.length - 1
                ? mixColor(this.groups[index].txtColor, this.groups[index + 1].txtColor)
                : this.groups[index].txtColor;
        this.groups.splice(index + 1, 0, { name: 'nv', txtColor, bgColor, list: [] });
    }

    addFiles(files: FileHandle[]) {
        this.list.push(...files);
    }

    saveImage() {
        this.dialog.open = true;
        html2canvas(document.getElementById('table-classement') as HTMLElement, {
            logging: false,
            allowTaint: false,
            useCORS: false,
            scale: 2,
        }).then(canvas => {
            const element = this.image.nativeElement;
            element.innerHTML = '';
            element.appendChild(canvas);
        });
    }
}
