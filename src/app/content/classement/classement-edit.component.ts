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
import { GlobalService, TypeFile } from 'src/app/services/global.service';
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
    new = false;
    id?: string;

    groups: FormatedGroup[] = [];
    list: FileString[] = [];

    options!: Options;

    @ViewChild('image') image!: ElementRef;
    @ViewChild('dialogImage') dialogImage!: DialogComponent;
    @ViewChild('dialogImport') dialogImport!: DialogComponent;

    jsonTmp?: Data;

    private _canvas?: HTMLCanvasElement;
    private _sub: Subscription[] = [];
    private _optionsCache?: Options;
    private _inputFile!: HTMLInputElement;

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
                    this.new = true;
                    this.options = { ...(this.globalService.jsonTmp?.options || defaultOptions) };
                    this.resetCache();
                    this.groups = this.globalService.jsonTmp?.groups || Utils.jsonCopy(defautGroup);
                    this.list = this.globalService.jsonTmp?.list || [];
                    this.id = undefined;
                    this.globalService.jsonTmp = undefined;
                }
            }),
            globalService.onFileLoaded.subscribe(file => {
                if (file.filter === TypeFile.image) {
                    this.addFile(file.file);
                } else if (file.filter === TypeFile.json) {
                    this.addJsonTemp(file.file);
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

    addFiles() {
        if (!this._inputFile) {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            document.body.appendChild(input);
            input.addEventListener(
                'change',
                (event: Event) => {
                    console.log('change - add file', (event.target as any).files);
                    this.globalService.addFiles((event.target as any).files, TypeFile.image);
                    input.outerHTML = '';
                },
                false,
            );
            this._inputFile = input;
        }

        this._inputFile.click();
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
        this.dialogImage.open();
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
        const title = this._getFileName();
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
        this.bdService.saveLocal(this._getData()).then(id => {
            this.id = id;
            this.resetCache();
        });
    }

    saveJson() {
        this._downloadFile(JSON.stringify(this._getData()), this._getFileName() + '.json', 'text/plain');
    }

    importJsonFile(event: Event) {
        this.jsonTmp = undefined;
        this.globalService.addFiles((event.target as any).files, TypeFile.json);
    }

    addJsonTemp(file: FileString) {
        try {
            const fileString = file.url?.replace('data:application/json;base64,', '');
            const json = JSON.parse(atob(fileString!)) as Data;

            if (Array.isArray(json.groups) && json.groups.length > 0 && Array.isArray(json.list) && json.options) {
                this.jsonTmp = json;
            }
        } catch (e) {
            console.error('json error:', e);
        }
    }

    countItem(): number {
        return (
            (this.jsonTmp?.list?.length || 0) +
            (this.jsonTmp?.groups?.reduce<number>((prev, curr) => prev + (curr.list?.length || 0), 0) || 0)
        );
    }

    importJson(type: 'replace' | 'new') {
        switch (this.new && type === 'new' ? 'replace' : type) {
            case 'replace': {
                this.groups = this.jsonTmp?.groups!;
                this.list = this.jsonTmp?.list!;
                this.options = this.jsonTmp?.options!;
                break;
            }
            case 'new': {
                this.globalService.jsonTmp = this.jsonTmp;
                this.router.navigate(['/edit', 'new']);
                break;
            }
        }
        this.cancelJson();
    }

    cancelJson() {
        this.jsonTmp = undefined;
        this.dialogImport.close();
    }

    private _getData(): Data {
        return {
            options: this.options,
            id: this.id,
            groups: this.groups,
            list: this.list,
        };
    }

    private _getFileName(): Data {
        return this.options.title.trim() || this.translate.instant('list.title.undefined');
    }

    private _downloadFile(content: string, fileName: string, contentType: string) {
        var a = document.createElement('a');
        var file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    private _downloadImage(data: string, filename: string) {
        const a = document.createElement('a');
        a.href = data;
        a.download = filename;
        a.click();
    }
}
