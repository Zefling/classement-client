import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, DoCheck, ElementRef, OnDestroy, Renderer2, RendererStyleFlags2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Coloration } from 'coloration-lib';
import html2canvas from 'html2canvas';
import { Subscription } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog.component';
import { Data, FileString, FormatedGroup, Options } from 'src/app/interface';
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

    categories: String[] = ['anime', 'game', 'video.game', 'board.game', 'movie', 'series', 'vehicle', 'other'];

    options: Options = {
        title: '',
        category: '',
        itemWidth: 100,
        itemHeight: 100,
        itemPadding: 10,
        itemBorder: 1,
        itemMargin: 2,
    };

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
                            this.options = data.infos.options;
                            this.groups = data.data.groups;
                            this.list = data.data.list;
                            this.editMode = true;
                        })
                        .catch(() => {
                            this.router.navigate(['new']);
                        });
                } else {
                    this.options = {
                        title: '',
                        category: '',
                        itemWidth: 100,
                        itemHeight: 100,
                        itemPadding: 10,
                        itemBorder: 1,
                        itemMargin: 2,
                    };
                    this.groups = defautGroup;
                    this.editMode = false;
                }
            }),
        );
    }

    ngDoCheck() {
        const body = document.body;
        const options = this.options;
        this.renderer.setStyle(body, '--item-width', (options.itemWidth || 100) + 'px', RendererStyleFlags2.DashCase);
        this.renderer.setStyle(body, '--item-height', (options.itemHeight || 100) + 'px', RendererStyleFlags2.DashCase);
        this.renderer.setStyle(body, '--item-padding', (options.itemPadding || 0) + 'px', RendererStyleFlags2.DashCase);
        this.renderer.setStyle(body, '--item-border', (options.itemBorder || 0) + 'px', RendererStyleFlags2.DashCase);
        this.renderer.setStyle(body, '--item-margin', (options.itemMargin || 0) + 'px', RendererStyleFlags2.DashCase);
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
        this.dialog.open();
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
            options: this.options,
            id: this.id,
            groups: this.groups,
            list: this.list,
        };

        this.bdService.saveLocal(data).then(id => this.id);
    }

    saveServer() {}
}
