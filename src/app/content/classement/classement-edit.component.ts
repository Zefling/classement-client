import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, DoCheck, ElementRef, OnDestroy, Renderer2, RendererStyleFlags2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Coloration } from 'coloration-lib';
import html2canvas from 'html2canvas';
import { Subscription } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog.component';
import { Data, FileString, FormatedGroup, Options } from 'src/app/interface';
import { DBService } from 'src/app/services/db.service';
import { GlobalService } from 'src/app/services/global.service';
import { Utils } from 'src/app/tools/utils';

import { defaultOptions, defautGroup } from './classement-default';


const color = (c: string, opacity: number): string | null => {
    return c ? new Coloration(c).addColor({ alpha: (-1 * (100 - opacity)) / 100 }).toHEX() : null;
};

@Component({
    selector: 'classement-edit',
    templateUrl: './classement-edit.component.html',
    styleUrls: ['./classement-edit.component.scss'],
})
export class ClassementEditComponent implements OnDestroy, DoCheck {
    id?: string;

    groups: FormatedGroup[] = [];
    list: FileString[] = [];

    options!: Options;

    @ViewChild('image') image!: ElementRef;
    @ViewChild(DialogComponent) dialog!: DialogComponent;

    private _canvas?: HTMLCanvasElement;
    private _sub: Subscription[] = [];
    private _optionsCache?: Options;

    constructor(
        private bdService: DBService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2,
        private translate: TranslateService,
        private globalService: GlobalService,
    ) {
        this._sub.push(
            this.route.params.subscribe(params => {
                if (params['id'] !== 'new') {
                    this.id = params['id'];
                    this.bdService
                        .loadLocal(params['id'])
                        .then(data => {
                            this.options = { ...defaultOptions, ...data.infos.options };
                            this.resetCache();
                            this.groups = data.data.groups;
                            this.list = data.data.list;
                        })
                        .catch(() => {
                            this.router.navigate(['new']);
                        });
                } else {
                    // reset all
                    this.options = { ...defaultOptions };
                    this.resetCache();
                    this.groups = Utils.jsonCopy(defautGroup);
                    this.list = [];
                    this.id = undefined;
                }
            }),
        );
    }

    ngDoCheck() {
        if (!this.options) {
            return;
        }

        const body = document.body;
        const o = this.options;
        const render = this.renderer;
        const dash = RendererStyleFlags2.DashCase;

        render.setStyle(body, '--item-width', (o.itemWidth || 100) + 'px', dash);
        render.setStyle(body, '--item-height', (o.itemHeight || 100) + 'px', dash);
        render.setStyle(body, '--item-padding', (o.itemPadding || 0) + 'px', dash);
        render.setStyle(body, '--item-border', (o.itemBorder || 0) + 'px', dash);
        render.setStyle(body, '--item-margin', (o.itemMargin || 0) + 'px', dash);
        render.setStyle(body, '--content-box-background', color(o.itemBackgroundColor, o.itemBackgroundOpacity), dash);
        render.setStyle(body, '--content-box-border', color(o.itemBorderColor, o.itemBorderOpacity), dash);
        render.setStyle(body, '--drop-list-background', color(o.lineBackgroundColor, o.lineBackgroundOpacity), dash);
        render.setStyle(body, '--drop-list-border-color', color(o.lineBorderColor, o.lineBorderOpacity), dash);

        if (this.options && !this.globalService.withChange && Utils.objectChange(this._optionsCache, this.options)) {
            this.globalService.withChange = true;
            console.log('Option change');
        }
    }

    ngOnDestroy() {
        this._sub.forEach(e => e.unsubscribe());
    }

    resetCache() {
        this.globalService.withChange = false;
        this._optionsCache = Utils.jsonCopy(this.options);
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
        this.globalService.withChange = true;
    }

    upLine(index: number) {
        this.groups.splice(index - 1, 0, this.groups.splice(index, 1)[0]);
        this.globalService.withChange = true;
    }

    downLine(index: number) {
        this.groups.splice(index + 1, 0, this.groups.splice(index, 1)[0]);
        this.globalService.withChange = true;
    }

    deleteLine(index: number) {
        this.list.push(...this.groups.splice(index, 1)[0].list);
        this.globalService.withChange = true;
    }

    removeItem(index: number) {
        this.list.splice(index, 1);
        this.globalService.withChange = true;
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
        this.globalService.withChange = true;
    }

    addFile(file: FileString) {
        this.list.push(file);
        this.globalService.withChange = true;
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
            this._canvas = canvas;
        });
    }

    saveImage(type: string) {
        const title = this.options.title.trim() || this.translate.instant('list.title.undefined');
        if (this._canvas) {
            switch (type) {
                case 'PNG':
                    this._downloadImage(this._canvas.toDataURL('image/png'), title + '.png');
                    break;
                case 'JPG':
                    this._downloadImage(this._canvas.toDataURL('image/jpeg', 1.0), title + '.jpeg');
                    break;
                case 'WEBP':
                    this._downloadImage(this._canvas.toDataURL('image/webp', 1.0), title + '.webp');
                    break;
            }
        }
    }

    saveLocal() {
        const data: Data = {
            options: this.options,
            id: this.id,
            groups: this.groups,
            list: this.list,
        };

        this.bdService.saveLocal(data).then(id => {
            this.id = id;
            this.resetCache();
        });
    }

    private _downloadImage(data: string, filename: string) {
        var a = document.createElement('a');
        a.href = data;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
    }
}
