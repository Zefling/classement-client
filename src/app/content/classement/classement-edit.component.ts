import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, DoCheck, ElementRef, OnDestroy, Renderer2, RendererStyleFlags2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Coloration } from 'coloration-lib';
import html2canvas from 'html2canvas';
import { Subscription } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog.component';
import { MessageService, MessageType } from 'src/app/components/info-messages.component';
import { Data, FileString, FormatedGroup, Options } from 'src/app/interface';
import { DBService } from 'src/app/services/db.service';
import { GlobalService, TypeFile } from 'src/app/services/global.service';
import { color } from 'src/app/tools/function';
import { Utils } from 'src/app/tools/utils';

import { defaultOptions, defautGroup } from './classement-default';


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
    nameOpacity!: string;

    @ViewChild('image') image!: ElementRef;
    @ViewChild('dialogImage') dialogImage!: DialogComponent;
    @ViewChild('dialogImport') dialogImport!: DialogComponent;
    @ViewChild('dialogOptimise') dialogOptimise!: DialogComponent;

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
        private messageService: MessageService,
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
                if (file.filter === TypeFile.image || file.filter === TypeFile.text) {
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
        const r = this.renderer;
        const dash = RendererStyleFlags2.DashCase;

        // item
        const itemWidth = o.itemWidthAuto ? 'auto' : (o.itemWidth ?? defaultOptions.imageWidth) + 'px';
        r.setStyle(body, '--over-item-width', itemWidth, dash);
        r.setStyle(body, '--over-item-height', (o.itemHeight ?? defaultOptions.itemHeight) + 'px', dash);
        r.setStyle(body, '--over-item-padding', (o.itemPadding ?? defaultOptions.itemPadding) + 'px', dash);
        r.setStyle(body, '--over-item-border', (o.itemBorder ?? defaultOptions.itemBorder) + 'px', dash);
        r.setStyle(body, '--over-item-margin', (o.itemMargin ?? defaultOptions.itemMargin) + 'px', dash);
        r.setStyle(body, '--over-item-background', color(o.itemBackgroundColor, o.itemBackgroundOpacity), dash);
        r.setStyle(body, '--over-item-border-color', color(o.itemBorderColor, o.itemBorderOpacity), dash);
        r.setStyle(body, '--over-item-text-color', o.itemTextColor ?? defaultOptions.itemTextColor, dash);
        // drop zone group
        r.setStyle(body, '--over-drop-list-background', color(o.lineBackgroundColor, o.lineBackgroundOpacity), dash);
        r.setStyle(body, '--over-drop-list-border-color', color(o.lineBorderColor, o.lineBorderOpacity), dash);
        // name group
        r.setStyle(body, '--over-name-width', (o.nameWidth ?? defaultOptions.nameWidth) + 'px', dash);
        r.setStyle(body, '--over-name-font-size', (o.nameFontSize ?? defaultOptions.nameFontSize) + '%', dash);
        // image background
        r.setStyle(body, '--over-image-background', o.imageBackgroundColor, dash);
        r.setStyle(body, '--over-image-width', (o.imageWidth ?? defaultOptions.imageWidth) + 'px', dash);
        r.setStyle(
            body,
            '--over-image-url',
            o.imageBackgroundImage !== 'none' ? 'url(./assets/themes/' + o.imageBackgroundImage + '.svg)' : null,
            dash,
        );

        this.nameOpacity =
            Math.round(o.nameBackgroundOpacity * 2.55)
                ?.toString(16)
                .padStart(2, '0') ?? 'FF';

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
            input.accept = '.jpg, .jpeg, .png, .gif, .webp';
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

    reset() {
        for (const ligne of this.groups) {
            this.list.push(...ligne.list);
            ligne.list = [];
        }
        this.messageService.addMessage(this.translate.instant('message.reset.groups'));
    }

    saveImage(type: string) {
        const title = this.getFileName();
        if (this._canvas) {
            switch (type) {
                case 'PNG':
                    this.downloadImage(this._canvas.toDataURL('image/png'), title + '.png');
                    break;
                case 'JPG':
                    this.downloadImage(this._canvas.toDataURL('image/jpeg', 1.0), title + '.jpeg');
                    break;
                case 'WEBP':
                    this.downloadImage(this._canvas.toDataURL('image/webp', 1.0), title + '.webp');
                    break;
            }
        }
    }

    saveLocal() {
        this.bdService.saveLocal(this.getData()).then(
            id => {
                this.id = id;
                this.messageService.addMessage(this.translate.instant('message.save.success'));
                this.resetCache();
            },
            _ => {
                this.messageService.addMessage(this.translate.instant('message.save.echec'), MessageType.error);
            },
        );
    }

    saveJson() {
        this.downloadFile(JSON.stringify(this.getData()), this.getFileName() + '.json', 'text/plain');
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
            } else {
                this.messageService.addMessage(this.translate.instant('message.json.read.echec'), MessageType.error);
            }
        } catch (e) {
            console.error('json error:', e);
            this.messageService.addMessage(this.translate.instant('message.json.read.echec'), MessageType.error);
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
                this.messageService.addMessage(this.translate.instant('message.json.read.replace'));
                break;
            }
            case 'new': {
                this.globalService.jsonTmp = this.jsonTmp;
                this.router.navigate(['/edit', 'new']);
                this.messageService.addMessage(this.translate.instant('message.json.read.new'));
                break;
            }
        }
        this.cancelJson();
    }

    cancelJson() {
        this.jsonTmp = undefined;
        this.dialogImport.close();
    }

    private getData(): Data {
        return {
            options: this.options,
            id: this.id,
            groups: this.groups,
            list: this.list,
        };
    }

    private getFileName(): Data {
        return this.options.title.trim() || this.translate.instant('list.title.undefined');
    }

    private downloadFile(content: string, fileName: string, contentType: string) {
        var a = document.createElement('a');
        var file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    private downloadImage(data: string, filename: string) {
        const a = document.createElement('a');
        a.href = data;
        a.download = filename;
        a.click();
    }
}
