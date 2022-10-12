import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, DoCheck, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Coloration } from 'coloration-lib';
import html2canvas from 'html2canvas';
import { Subscription } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog.component';
import { ImportJsonEvent } from 'src/app/components/import-json.component';
import { MessageService, MessageType } from 'src/app/components/info-messages.component';
import { Classement, Data, FileString, FormatedGroup, Options } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { GlobalService, TypeFile } from 'src/app/services/global.service';
import { Logger, LoggerLevel } from 'src/app/services/logger';
import { Utils } from 'src/app/tools/utils';
import { environment } from 'src/environments/environment';

import { defaultOptions, defautGroup } from './classement-default';


@Component({
    selector: 'classement-edit',
    templateUrl: './classement-edit.component.html',
    styleUrls: ['./classement-edit.component.scss'],
})
export class ClassementEditComponent implements OnDestroy, DoCheck {
    new = false;
    id?: string;

    classement?: Classement;

    derivatives?: Classement[];

    groups: FormatedGroup[] = [];
    list: FileString[] = [];

    diff?: FileString[];

    options!: Options;
    nameOpacity!: string;

    changeTimer: any[] = [];

    logged = false;

    hasItems = false;

    shareUrl: string = '';

    imagesCache: { [key: string]: string | ArrayBuffer | null } = {};

    classScreenMode: 'default' | 'enlarge' | 'fullscreen' = 'default';

    apiActive = environment.api?.active;

    @ViewChild('image') image!: ElementRef;
    @ViewChild('dialogImage') dialogImage!: DialogComponent;
    @ViewChild('dialogImport') dialogImport!: DialogComponent;
    @ViewChild('dialogOptimise') dialogOptimise!: DialogComponent;
    @ViewChild('dialogSaveServer') dialogSaveServer!: DialogComponent;
    @ViewChild('dialogDerivatives') dialogDerivatives!: DialogComponent;
    @ViewChild('dialogRankingDiff') dialogRankingDiff!: DialogComponent;

    private _canvas?: HTMLCanvasElement;
    private _sub: Subscription[] = [];
    private _optionsCache?: Options;
    private _inputFile!: HTMLInputElement;

    constructor(
        private bdService: DBService,
        private router: Router,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private globalService: GlobalService,
        private messageService: MessageService,
        private userService: APIUserService,
        private classementService: APIClassementService,
        private logger: Logger,
    ) {
        this._sub.push(
            this.route.params.subscribe(params => {
                if (params['id'] && params['id'] !== 'new') {
                    this.id = params['id'];

                    if (this.apiActive) {
                        this.userService.loggedStatus().then(() => {
                            this.logged = this.userService.logged ?? false;
                            const classement = this.userService.user?.classements?.find(e => e.rankingId === this.id);
                            if (classement) {
                                this.logger.log('loadServerClassement (user)');
                                this.loadServerClassement(classement);
                            } else {
                                this.classementService
                                    .getClassement(this.id!)
                                    .then(classement => {
                                        this.logger.log('loadServerClassement (server)');
                                        this.loadServerClassement(classement);
                                    })
                                    .catch(() => {
                                        this.logger.log('loadLocalClassement (browser)');
                                        this.loadLocalClassement();
                                    });
                            }
                        });
                    } else {
                        this.loadLocalClassement();
                    }
                } else {
                    if (this.apiActive) {
                        this.userService.loggedStatus().then(() => {
                            this.logged = this.userService.logged ?? false;
                        });
                    }
                    // reset all
                    this.new = true;
                    this.options = {
                        ...defaultOptions,
                        ...(this.globalService.jsonTmp?.options || defaultOptions),
                        ...{ showAdvancedOptions: false },
                    };
                    this.resetCache();
                    this.groups = this.globalService.jsonTmp?.groups || Utils.jsonCopy(defautGroup);
                    this.list = this.globalService.jsonTmp?.list || [];
                    this.id = undefined;
                    this.classement = undefined;
                    this.globalService.jsonTmp = undefined;
                }
            }),
            globalService.onFileLoaded.subscribe(file => {
                if (file.filter === TypeFile.image || file.filter === TypeFile.text) {
                    this.addFile(file.file);
                }
            }),
            userService.afterLogout.subscribe(() => {
                this.logged = false;
            }),
        );
    }

    loadLocalClassement() {
        this.bdService
            .loadLocal(this.id!)
            .then(data => {
                this.logger.log('local found');

                const rankingId = data.infos.rankingId;
                const templateId = data.infos.templateId;
                const parentId = data.infos.parentId;

                this.classement = {
                    localId: this.id!,
                    rankingId,
                    templateId,
                    parentId,
                } as any;

                if (rankingId && this.userService.logged) {
                    const classement = this.userService.user?.classements?.find(e => e.rankingId === rankingId);
                    if (classement) {
                        this.classement!.user = classement.user;
                        this.classement!.name = classement.name;
                        this.classement!.category = classement.category;
                        this.classement!.banner = classement.banner;
                    }
                }

                this.options = { ...defaultOptions, ...data.infos.options, ...{ showAdvancedOptions: false } };
                this.resetCache();
                this.groups = data.data.groups;
                this.list = data.data.list;
                this.globalService.fixImageSize(this.groups, this.list);
                setTimeout(() => {
                    this.globalService.imagesCache(this.groups, this.list).then(cache => (this.imagesCache = cache));
                });
            })
            .catch(() => {
                this.logger.log('local not found');
                this.router.navigate(['/edit', 'new']);
            });
    }

    loadServerClassement(classement: Classement, withDerivative: boolean = true) {
        this.classement = classement;
        this.options = { ...defaultOptions, ...classement.data.options, ...{ showAdvancedOptions: false } };
        this.resetCache();
        this.groups = classement.data.groups;
        this.list = classement.data.list;
        setTimeout(() => {
            this.globalService.imagesCache(this.groups, this.list).then(cache => (this.imagesCache = cache));
        });

        if (withDerivative && this.logged) {
            this.classementService
                .getClassementsByTemplateId(this.classement?.templateId, this.userService.user?.id)
                .then(classements => {
                    this.derivatives = classements;
                });
        }
    }

    loadDerivativeClassement(classement: Classement) {
        this.router.navigate(['/edit', classement.rankingId]);
        this.dialogDerivatives.close();
    }

    ngDoCheck() {
        if (!this.options) {
            return;
        }

        const val = this.globalService.updateVarCss(this.options);
        this.nameOpacity = val.nameOpacity;

        if (this.options && !this.globalService.withChange && Utils.objectChange(this._optionsCache, this.options)) {
            this.globalService.withChange = true;
            this.logger.log('Option change');
            this.change();
        }

        this.hasItems = this.list.length > 0 || this.groups.some(e => e.list.length > 0);

        this.shareUrl =
            this.apiActive && this.classement?.rankingId
                ? `https://${window.location.host}/edit/${this.classement.rankingId}`
                : '';
    }

    ngOnDestroy() {
        this._sub.forEach(e => e.unsubscribe());
    }

    @HostListener('window:beforeunload', ['$event'])
    canDeactivate(event: BeforeUnloadEvent): void {
        // apply logic
        // if blocking is required -> show message to the user
        // if the user decide to stay in the page:
        if (this.globalService.withChange) {
            event.returnValue = true;
        }
    }

    showDerivative() {
        this.dialogDerivatives.open();
    }

    showRankingDiff() {
        if (this.classement) {
            //this.loading = true;
            this.classementService
                .getClassementsByTemplateId(this.classement.templateId)
                .then(classements => {
                    this.diff = [];
                    // current tiles
                    const list: FileString[] = [];
                    list.push(...this.list);
                    this.groups.forEach(e => list.push(...e.list));

                    if (classements?.length) {
                        classements.forEach(c => {
                            const listCompare = [];
                            listCompare.push(...c.data.list);
                            c.data.groups.forEach(e => listCompare.push(...e.list));

                            listCompare.forEach(tile => {
                                // compare with exist
                                for (const item of list) {
                                    if (item.url === tile.url || (!item.url && item.title == tile.title)) {
                                        return;
                                    }
                                }
                                // compare with previous added
                                for (const item of this.diff!) {
                                    if (item.url === tile.url || (!item.url && item.title == tile.title)) {
                                        return;
                                    }
                                }
                                this.diff?.push(tile);
                            });
                        });
                    }
                })
                .catch(e => {
                    this.messageService.addMessage(e, {
                        type: MessageType.error,
                    });
                })
                .finally(() => {
                    //  this.loading = false;
                });

            this.dialogRankingDiff.open();
        }
    }

    addTile(tile: FileString) {
        this.list.push(tile);
        this.diff!.splice(this.diff!.indexOf(tile), 1);
    }

    resetCache() {
        this.globalService.withChange = false;
        this._optionsCache = Utils.jsonCopy(this.options);
    }

    toTemplateNavigation() {
        this.router.navigate(['navigate', 'template', this.classement!.templateId]);
    }

    copyLink() {
        Utils.copy(this.shareUrl)
            .then(() => this.messageService.addMessage(this.translate.instant('gererator.ranking.copy.link.success')))
            .catch(e =>
                this.messageService.addMessage(this.translate.instant('gererator.ranking.copy.link.error'), {
                    type: MessageType.error,
                }),
            );
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
        this.change();
    }

    addFiles() {
        if (!this._inputFile) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.jpg, .jpeg, .png, .gif, .webp, .avif';
            input.multiple = true;
            document.body.appendChild(input);
            input.addEventListener(
                'change',
                (event: Event) => {
                    this.logger.log('change - add file', LoggerLevel.log, (event.target as any).files);
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
        this.change();
    }

    downLine(index: number) {
        this.groups.splice(index + 1, 0, this.groups.splice(index, 1)[0]);
        this.globalService.withChange = true;
        this.change();
    }

    deleteLine(index: number) {
        this.list.push(...this.groups.splice(index, 1)[0].list);
        this.globalService.withChange = true;
        this.change();
    }

    removeItem(index: number) {
        this.list.splice(index, 1);
        this.globalService.withChange = true;
        this.change();
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
        this.change();
    }

    addFile(file: FileString) {
        this.list.push(file);
        this.globalService.withChange = true;
        this.change();
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

    change() {
        if (this.options.autoSave) {
            if (this.changeTimer.length) {
                for (let i = this.changeTimer.length - 1; i === 0; i--) {
                    clearTimeout(this.changeTimer[i]);
                    this.changeTimer.splice(i);
                }
            }

            this.changeTimer.push(
                setTimeout(() => {
                    this.saveLocal(true);
                }, 2000),
            );
        }
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

    saveLocal(silence: boolean = false) {
        this.bdService.saveLocal(this.getData()).then(
            item => {
                this.id = item.data.id;
                if (this.new) {
                    this.router.navigate(['/edit', this.id]);
                }
                this.new = false;
                if (this.classement && this.id) {
                    this.classement.localId = this.id;
                }
                if (!silence) {
                    this.messageService.addMessage(this.translate.instant('message.save.success'));
                }
                this.resetCache();
            },
            _ => {
                this.messageService.addMessage(this.translate.instant('message.save.echec'), {
                    type: MessageType.error,
                });
            },
        );
    }

    saveServer() {
        if (this.logged) {
            this.classement;
            this.dialogSaveServer.open();
        }
    }

    updateAfterServerSave(classement: Classement) {
        // update local data
        this.classement = classement;
        this.list = classement.data.list;
        this.groups = classement.data.groups;
        this.options = classement.data.options;

        if (classement.localId) {
            // persist data
            this.saveLocal();
        }
    }

    saveJson() {
        Utils.downloadFile(JSON.stringify(this.getData()), this.getFileName() + '.json', 'text/plain');
    }

    importJson(event: ImportJsonEvent) {
        switch (this.new && event.action === 'new' ? 'replace' : event.action) {
            case 'replace': {
                this.groups = event.data?.groups!;
                this.list = event.data?.list!;
                this.options = { ...defaultOptions, ...event.data?.options! };
                this.messageService.addMessage(this.translate.instant('message.json.read.replace'));
                break;
            }
            case 'new': {
                this.globalService.jsonTmp = event.data;
                this.router.navigate(['/edit', 'new']);
                this.messageService.addMessage(this.translate.instant('message.json.read.new'));
                break;
            }
        }
        this.dialogImport.close();
    }

    screenMode(mode: 'default' | 'enlarge' | 'fullscreen', div?: HTMLDivElement) {
        this.classScreenMode = mode;

        if (div) {
            if (mode === 'fullscreen') {
                div.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    }

    @HostListener('window:fullscreenchange')
    screenModeFullscren() {
        if (!document.fullscreenElement) {
            this.screenMode('default');
        }
    }

    private getData(): Data {
        return {
            options: this.options,
            id: this.classement?.localId || this.id,
            groups: this.groups,
            list: this.list,
            rankingId: this.classement?.localId && this.classement?.rankingId ? this.classement?.rankingId : null,
            templateId: this.classement?.templateId,
            parentId: this.classement?.parentId,
        };
    }

    private getFileName(): Data {
        return this.options.title.trim() || this.translate.instant('list.title.undefined');
    }

    private downloadImage(data: string, filename: string) {
        const a = document.createElement('a');
        a.href = data;
        a.download = filename;
        a.click();
    }
}
