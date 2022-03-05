import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, DoCheck, ElementRef, OnDestroy, Renderer2, RendererStyleFlags2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Coloration } from 'coloration-lib';
import html2canvas from 'html2canvas';
import { Subscription } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog.component';
import { Data, FileString, FormatedGroup } from 'src/app/interface';
import { DBService } from 'src/app/services/db.service';


const defautGroup: FormatedGroup[] = [
    { name: 'S', bgColor: '#dc8add', txtColor: '#000000', list: [] },
    { name: 'A', bgColor: '#f66151', txtColor: '#000000', list: [] },
    { name: 'B', bgColor: '#ffbe6f', txtColor: '#000000', list: [] },
    { name: 'C', bgColor: '#f9f06b', txtColor: '#000000', list: [] },
    { name: 'D', bgColor: '#8ff0a4', txtColor: '#000000', list: [] },
    { name: 'E', bgColor: '#99c1f1', txtColor: '#000000', list: [] },
];

@Component({
    selector: 'classement-edit',
    templateUrl: './classement-edit.component.html',
    styleUrls: ['./classement-edit.component.scss'],
})
export class ClassementEditComponent implements OnDestroy, DoCheck {
    editMode = false;
    id?: string;

    groups: FormatedGroup[] = [];
    list: FileString[] = [];

    categories: String[] = ['anime', 'video.game', 'movie'];

    title = '';
    category = '';
    itemWidth = 100;
    itemHeight = 100;
    itemPadding = 10;

    @ViewChild('image') image!: ElementRef;
    @ViewChild(DialogComponent) dialog!: DialogComponent;

    private _sub: Subscription[] = [];

    constructor(
        private bdService: DBService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2,
    ) {
        this._sub.push(
            this.route.params.subscribe(params => {
                if (params['id'] !== 'new') {
                    this.id = params['id'];
                    this.bdService
                        .loadLocal(params['id'])
                        .then(data => {
                            this.title = data.infos.options.title;
                            this.category = data.infos.options.category;
                            this.itemWidth = data.infos.options.itemWidth;
                            this.itemHeight = data.infos.options.itemHeight;
                            this.itemPadding = data.infos.options.itemPadding;
                            this.groups = data.data.groups;
                            this.list = data.data.list;
                            this.editMode = true;
                        })
                        .catch(() => {
                            this.router.navigate(['new']);
                        });
                } else {
                    this.title = '';
                    this.category = '';
                    this.itemWidth = 100;
                    this.itemHeight = 100;
                    this.itemPadding = 10;
                    this.groups = defautGroup;
                    this.editMode = false;
                }
            }),
        );
    }

    ngDoCheck() {
        this.renderer.setStyle(document.body, '--item-width', this.itemWidth + 'px', RendererStyleFlags2.DashCase);
        this.renderer.setStyle(document.body, '--item-height', this.itemHeight + 'px', RendererStyleFlags2.DashCase);
        this.renderer.setStyle(document.body, '--item-padding', this.itemPadding + 'px', RendererStyleFlags2.DashCase);
    }

    ngOnDestroy() {
        this._sub.forEach(e => e.unsubscribe());
    }

    drop(list: FileString[], event: CdkDragDrop<{ list: FileString[]; index: number }>) {
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

    upLine(index: number) {
        this.groups.splice(index - 1, 0, this.groups.splice(index, 1)[0]);
    }

    downLine(index: number) {
        this.groups.splice(index + 1, 0, this.groups.splice(index, 1)[0]);
    }

    deleteLine(index: number) {
        this.list.push(...this.groups.splice(index, 1)[0].list);
    }

    removeItem(index: number) {
        this.list.splice(index, 1);
    }

    addLine(index: number) {
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

    addFile(file: FileString) {
        this.list.push(file);
    }

    exportImage() {
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

    saveLocal() {
        const data: Data = {
            options: {
                title: this.title,
                category: this.category,
                itemWidth: this.itemWidth,
                itemHeight: this.itemHeight,
                itemPadding: this.itemPadding,
            },
            id: this.id,
            groups: this.groups,
            list: this.list,
        };

        this.bdService.saveLocal(data).then(id => this.id);
    }

    saveServer() {}
}
