import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    DoCheck,
    ElementRef,
    HostBinding,
    HostListener,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Coloration } from 'coloration-lib';
import html2canvas from 'html2canvas';
import { Subject, debounceTime, first } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ImportJsonEvent } from 'src/app/components/import-json/import-json.component';
import { MessageService, MessageType } from 'src/app/components/info-messages/info-messages.component';
import {
    Classement,
    Data,
    FileString,
    FormatedGroup,
    GroupOption,
    ImageCache,
    Options,
    PreferenceLineOption,
    ScreenMode,
} from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { GlobalService, TypeFile } from 'src/app/services/global.service';
import { Logger, LoggerLevel } from 'src/app/services/logger';
import { OptimiseImageService } from 'src/app/services/optimise-image.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';
import { environment } from 'src/environments/environment';

import { defaultOptions, defaultTheme, defautGroup } from './classement-default';
import { ClassementEditImageComponent } from './classement-edit-image.component';
import { ClassementLoginComponent } from './classement-login.component';

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
    lockCategory = false;

    diff?: FileString[];

    options!: Options;
    nameOpacity!: string;
    currentGroup?: GroupOption;

    changeTimer: any[] = [];

    logged = false;

    hasItems = false;

    exportImageLoading = false;
    exportImageDisabled = false;

    size = 0;

    shareUrl = '';

    scrollArrows = false;

    imagesCache: ImageCache = {};

    classScreenMode: ScreenMode = 'default';
    lineOption: PreferenceLineOption = 'auto';

    apiActive = environment.api?.active;

    currentTile?: FileString;

    @HostBinding('class.option-reduce')
    get optionReduce() {
        return this.lineOption === 'reduce';
    }

    @HostBinding('class.option-hidden')
    get optionHidden() {
        return this.lineOption === 'hidden';
    }

    @ViewChild('image') image!: ElementRef<HTMLDivElement>;
    @ViewChild('currentList') currentList!: ElementRef<HTMLDivElement>;
    @ViewChild('dialogImage') dialogImage!: DialogComponent;
    @ViewChild('dialogImport') dialogImport!: DialogComponent;
    @ViewChild('dialogOptimise') dialogOptimise!: DialogComponent;
    @ViewChild('dialogSaveServer') dialogSaveServer!: DialogComponent;
    @ViewChild('dialogDerivatives') dialogDerivatives!: DialogComponent;
    @ViewChild('dialogRankingDiff') dialogRankingDiff!: DialogComponent;
    @ViewChild('dialogGroupOption') dialogGroupOption!: DialogComponent;
    @ViewChild(ClassementEditImageComponent) editImage!: ClassementEditImageComponent;
    @ViewChild(ClassementLoginComponent) login!: ClassementLoginComponent;

    private _canvas?: HTMLCanvasElement;
    private _sub = Subscriptions.instance();
    private _optionsCache?: Options;
    private _inputFile!: HTMLInputElement;
    private _detectChange = new Subject<void>();

    constructor(
        private readonly bdService: DBService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly translate: TranslateService,
        private readonly global: GlobalService,
        private readonly messageService: MessageService,
        private readonly userService: APIUserService,
        private readonly classementService: APIClassementService,
        private readonly optimiseImage: OptimiseImageService,
        private readonly logger: Logger,
        private readonly cd: ChangeDetectorRef,
        private readonly location: Location,
        private readonly preferencesService: PreferencesService,
    ) {
        this.updateTitle();

        this._sub.push(
            this.route.params.subscribe(params => {
                if (this.preferencesService.hasInit) {
                    this.initWithParams(params);
                } else {
                    this.preferencesService.onInit.pipe(first()).subscribe(() => {
                        this.initWithParams(params);
                    });
                }
            }),
            global.onFileLoaded.subscribe(file => {
                if (file.filter === TypeFile.image || file.filter === TypeFile.text) {
                    this.addFile(file.file);
                }
                this.updateSize();
            }),
            userService.afterLogout.subscribe(() => {
                this.logged = false;
            }),
            global.onImageUpdate.subscribe(() => {
                this.updateSize();
            }),
            global.onLocalSave.subscribe(() => {
                this.saveLocal(false, false);
            }),
            this._detectChange.pipe(debounceTime(10)).subscribe(() => {
                this.cd.detectChanges();
            }),
            this.translate.onLangChange.subscribe(() => {
                this.updateTitle();
            }),
        );
    }

    updateTitle() {
        this.global.setTitle('menu.edit');
    }

    initWithParams(params: Params) {
        const fork = params['fork'] === 'fork';
        this.lockCategory = false;

        if (params['id'] && params['id'] !== 'new') {
            this.id = params['id'];
            this.exportImageLoading = true;
            this.exportImageDisabled = true;

            if (this.apiActive) {
                this.userService.loggedStatus().then(() => {
                    this.logged = this.userService.logged ?? false;
                    let classement = this.userService.user?.classements?.find(e => e.rankingId === this.id);
                    if (!classement) {
                        classement = this.userService.getByIdFormCache(this.id!);
                    }
                    if (classement) {
                        this.logger.log('loadServerClassement (user)');
                        this.loadServerClassement(classement, fork);
                    } else {
                        this.classementService
                            .getClassement(this.id!)
                            .then(classement => {
                                this.logger.log('loadServerClassement (server)');
                                this.loadServerClassement(classement, fork);
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
            const defaultOptions = Utils.jsonCopy(defaultTheme(this.preferencesService.preferences.theme).options);
            this.new = true;
            this.options = {
                ...defaultOptions,
                ...(this.global.jsonTmp?.options || defaultOptions),
                ...{ showAdvancedOptions: false },
            };

            this.groups = this.global.jsonTmp?.groups || Utils.jsonCopy(defautGroup);
            this.list = this.global.jsonTmp?.list || [];
            this.addIds();
            this.id = undefined;
            this.classement = undefined;
            this.global.jsonTmp = undefined;

            this.exportImageLoading = false;
            this.resetCache();
        }
    }

    loadLocalClassement() {
        this.bdService
            .loadLocal(this.id!)
            .then(data => {
                this.logger.log('local found');

                const rankingId = data.infos.rankingId;
                const templateId = data.infos.templateId;
                const parentId = data.infos.parentId;
                const linkId = data.infos.linkId;
                const banner = data.infos.banner;

                this.classement = {
                    localId: this.id!,
                    rankingId,
                    templateId,
                    parentId,
                    linkId,
                    banner,
                } as any;

                this.lockCategory = !!data.infos.parentId;

                if (rankingId && this.userService.logged) {
                    const classement = this.userService.user?.classements?.find(e => e.rankingId === rankingId);
                    if (classement) {
                        this.classement!.user = classement.user;
                        this.classement!.name = classement.name;
                        this.classement!.category = classement.category;
                        this.classement!.banner = classement.banner;
                    }
                }
                this.options = {
                    ...Utils.jsonCopy(defaultTheme(this.preferencesService.preferences.theme).options),
                    ...data.infos.options,
                    ...{ showAdvancedOptions: false },
                };
                this.groups = data.data.groups;
                this.list = data.data.list;
                this.addIds();
                this.global.fixImageSize(this.groups, this.list);
                this.html2canavasImagesCacheUpdate();
                this.size = this.optimiseImage.size(this.list, this.groups, this.options.mode).size;
                this.resetCache();
            })
            .catch(() => {
                this.logger.log('local not found');
                this.router.navigate(['edit', 'new']);
            });
    }

    loadServerClassement(classement: Classement, fork: boolean, withDerivative: boolean = true) {
        this.classement = classement;
        this.options = {
            ...Utils.jsonCopy(defaultTheme(this.preferencesService.preferences.theme).options),
            ...classement.data.options,
            ...{ showAdvancedOptions: false, category: classement.category },
        };
        this.groups = classement.data.groups;
        this.list = classement.data.list;
        this.teamsModeUpdateTile();
        this.addIds();
        this.lockCategory = !classement.parent || classement.user !== this.userService.user?.username;
        this.html2canavasImagesCacheUpdate();

        if (withDerivative && this.logged) {
            this.classementService
                .getClassementsByTemplateId(this.classement?.templateId, this.userService.user?.id)
                .then(classements => {
                    this.derivatives = classements;
                });
        }

        if (fork) {
            this.reset();
            this.id = undefined;
            this.new = true;
            classement.linkId = '';
        }

        this.updateSize();
        this.resetCache();
    }

    loadDerivativeClassement(classement: Classement) {
        this.router.navigate(['edit', this.getClassementId(classement)]);
        this.dialogDerivatives.close();
    }

    ngDoCheck() {
        if (!this.options) {
            return;
        }

        this.lineOption = this.preferencesService.preferences.lineOption;

        const val = this.global.updateVarCss(this.options, this.imagesCache);
        this.nameOpacity = this.global.getValuesFromOptions(this.options).nameOpacity;

        // fix category with select2
        this.options.category ??= '';

        if (
            this.options &&
            !this.global.withChange &&
            !Utils.objectsAreSame(this._optionsCache, this.options, ['autoSave', 'showAdvancedOptions'])
        ) {
            this.globalChange();
            this.logger.log('Option change');
            this.change();
        }

        this.hasItems = this.list.length > 0 || this.groups.some(e => e.list.length > 0);

        this.shareUrl =
            this.apiActive && this.classement?.rankingId
                ? `${location.protocol}//${location.host}/navigate/view/${this.getClassementId(this.classement)}`
                : '';

        if (this.currentList) {
            this.scrollArrows = this.currentList.nativeElement.scrollWidth > this.currentList.nativeElement.clientWidth;
        }
    }

    trackByFnFileString(_index: number, item: FileString) {
        return item.url;
    }

    calcWidth(item: FileString, tile: HTMLElement | null) {
        // hack for calcule de width of the image
        Utils.calcWidth(this.options, item, tile);
        return true;
    }

    calcWidthEdit(item: FileString, element: HTMLElement | null) {
        if (!item.width) {
            const image = element?.querySelector('img');
            item.width = image?.naturalWidth;
            item.height = image?.naturalHeight;
        }

        return this.options.itemWidthAuto
            ? Math.round(Math.min(300, ((item.width || 100) / (item.height || 100)) * this.options.itemHeight))
            : null;
    }

    detectChanges() {
        this._detectChange.next();
    }

    ngOnDestroy() {
        this._sub.clear();
    }

    @HostListener('window:beforeunload', ['$event'])
    canDeactivate(event: BeforeUnloadEvent): void {
        // apply logic
        // if blocking is required -> show message to the user
        // if the user decide to stay in the page:
        if (this.global.withChange) {
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
                        classements.forEach(classement => {
                            const listCompare = [];
                            listCompare.push(...classement.data.list);
                            classement.data.groups.forEach(e => listCompare.push(...e.list));

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
        this.addIds();
        this.diff!.splice(this.diff!.indexOf(tile), 1);
    }

    resetCache() {
        this._optionsCache = Utils.jsonCopy(this.options);
        this.global.withChange = false;
    }

    toTemplateNavigation() {
        this.router.navigate(['navigate', 'template', this.classement!.templateId]);
    }

    copyLink() {
        Utils.clipboard(this.shareUrl)
            .then(() => this.messageService.addMessage(this.translate.instant('gererator.ranking.copy.link.success')))
            .catch(_e =>
                this.messageService.addMessage(this.translate.instant('gererator.ranking.copy.link.error'), {
                    type: MessageType.error,
                }),
            );
    }

    show() {
        this.router.navigate([`/navigate/view/${this.getClassementId(this.classement!)}`]);
    }

    drop(list: FileString[], event: CdkDragDrop<{ list: FileString[]; index: number }>) {
        const indexFrom = event.previousContainer.data.index;
        const indexTarget = event.container.data.index;
        if (event.previousContainer.data.list === event.container.data.list) {
            moveItemInArray(list, indexFrom, indexTarget);
        } else {
            const indexFix = this.options.direction === 'ltr' ? event.currentIndex : event.currentIndex === 0 ? 1 : 0;

            if (this.options.mode === 'teams') {
                if (
                    this.listIsType(event.previousContainer.data.list, 'list') &&
                    this.listIsType(event.container.data.list, 'group') &&
                    !event.container.data.list.find(tile => tile.id === event.previousContainer.data.list[indexFrom].id)
                ) {
                    copyArrayItem(
                        event.previousContainer.data.list,
                        event.container.data.list,
                        indexFrom,
                        indexTarget + indexFix,
                    );
                } else if (
                    this.listIsType(event.previousContainer.data.list, 'group') &&
                    this.listIsType(event.container.data.list, 'group')
                ) {
                    if (
                        !event.container.data.list.find(
                            tile => tile.id === event.previousContainer.data.list[indexFrom].id,
                        )
                    ) {
                        transferArrayItem(
                            event.previousContainer.data.list,
                            event.container.data.list,
                            indexFrom,
                            indexTarget + indexFix,
                        );
                    } else {
                        event.previousContainer.data.list.splice(indexFrom, 1);
                    }
                } else if (
                    this.listIsType(event.previousContainer.data.list, 'group') &&
                    this.listIsType(event.container.data.list, 'list')
                ) {
                    event.previousContainer.data.list.splice(indexFrom, 1);
                }
            } else {
                transferArrayItem(
                    event.previousContainer.data.list,
                    event.container.data.list,
                    indexFrom,
                    indexTarget + indexFix,
                );
            }
        }
        this.globalChange();
        this.detectChanges();
        this.change();
    }

    addFiles() {
        if (!this._inputFile) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.jpg, .jpeg, .png, .gif, .webp, .avif';
            input.multiple = true;
            input.addEventListener(
                'change',
                (event: Event) => {
                    this.logger.log('change - add file', LoggerLevel.log, (event.target as any).files);
                    this.global.addFiles((event.target as any).files, TypeFile.image);
                    input.outerHTML = '';
                },
                false,
            );
            this._inputFile = input;
        }

        this._inputFile.click();
    }

    globalChange() {
        this.global.withChange = true;
    }

    upLine(index: number) {
        this.groups.splice(index - 1, 0, this.groups.splice(index, 1)[0]);
        this.addIds();
        this.globalChange();
        this.change();
    }

    downLine(index: number) {
        this.groups.splice(index + 1, 0, this.groups.splice(index, 1)[0]);
        this.addIds();
        this.globalChange();
        this.change();
    }

    deleteLine(index: number) {
        if (this.options.mode === 'teams') {
            this.groups.splice(index, 1);
        } else {
            this.list.push(...this.groups.splice(index, 1)[0].list);
        }
        this.addIds();
        this.globalChange();
        this.change();
    }

    removeItem(index: number) {
        const removeTile = this.list.splice(index, 1);
        if (this.options.mode === 'teams') {
            this.groups.forEach(group => {
                const index = group.list.findIndex(tile => tile.id === removeTile[0].id);
                if (index !== -1) {
                    group.list.splice(index, 1);
                }
            });
        }
        this.globalChange();
        this.updateSize();
        this.change();
    }

    updateGoupOption(group: GroupOption) {
        this.currentGroup = group;
        this.dialogGroupOption.open();
    }

    updateSize() {
        this.size = this.optimiseImage.size(this.list, this.groups, this.options.mode).size;
    }

    addLine(index: number) {
        const isBelow = this.preferencesService.preferences.newLine === 'below';
        const nextIndex = isBelow ? index + 1 : index;
        const colorIndex = isBelow ? Math.min(index + 1, this.groups.length - 1) : Math.max(index - 1, 0);

        const mixColor = (color1: string, color2: string) =>
            new Coloration(color1).addColor({ maskColor: color2, maskOpacity: 0.5 }).toHEX();
        const bgColor =
            index < this.groups.length - 1 && this.preferencesService.preferences.newColor !== 'same'
                ? mixColor(this.groups[index].bgColor, this.groups[colorIndex].bgColor)
                : this.groups[index].bgColor;
        const txtColor =
            index < this.groups.length - 1 && this.preferencesService.preferences.newColor !== 'same'
                ? mixColor(this.groups[index].txtColor, this.groups[colorIndex].txtColor)
                : this.groups[index].txtColor;
        this.groups.splice(nextIndex, 0, {
            name: this.translate.instant('New'),
            txtColor,
            bgColor,
            list: [],
        });

        this.globalChange();
        this.change();
    }

    addFile(file: FileString) {
        if (this.preferencesService.preferences.nameCopy) {
            // remove extension
            file.title = (file.name || '').replace(/_/g, ' ').replace(/\.(\w+)$/, '');
        }

        this.list.push(file);
        this.addIds();
        this.globalChange();
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
            if (this.options.mode !== 'teams') {
                this.list.push(...ligne.list);
            }
            ligne.list = [];
        }
        this.addIds();
        this.messageService.addMessage(this.translate.instant('message.reset.groups'));
    }

    saveLocal(silence: boolean = false, route: boolean = true) {
        this.bdService.saveLocal(this.getData()).then(
            item => {
                this.resetCache();
                if (route && (this.new || this.id !== item.data.id)) {
                    this.location.replaceState('/edit/' + item.data.id);
                }
                this.id = item.data.id;
                this.new = false;
                if (this.classement && this.id) {
                    this.classement.localId = this.id;
                }
                if (!silence) {
                    this.messageService.addMessage(this.translate.instant('message.save.success'));
                }
                this.global.updateList();
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
            this.dialogSaveServer.open();
        } else {
            this.login.open();
        }
    }

    updateAfterServerSave(classement: Classement) {
        const navigate =
            this.classement?.linkId !== classement.linkId ||
            this.classement?.rankingId !== classement.rankingId ||
            this.id !== classement.rankingId;

        // update local data
        this.classement = classement;
        this.list = classement.data.list;
        this.groups = classement.data.groups;
        this.options = classement.data.options;
        this.teamsModeUpdateTile();
        this.addIds();

        this.html2canavasImagesCacheUpdate();

        if (classement.localId) {
            // persist data
            this.saveLocal(false, false);
        }

        if (navigate) {
            this.id = classement.rankingId;
            this.resetCache();
            this.location.replaceState('/edit/' + this.getClassementId(classement));
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
                this.addIds();
                this.options = { ...defaultOptions, ...event.data?.options! };
                this.messageService.addMessage(this.translate.instant('message.json.read.replace'));
                this.html2canavasImagesCacheUpdate();
                break;
            }
            case 'new': {
                this.global.jsonTmp = event.data;
                this.router.navigate(['edit', 'new']);
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

    openTileInfo(item: FileString) {
        this.currentTile = item;
        this.editImage.open();
    }

    @HostListener('window:fullscreenchange')
    screenModeFullscren() {
        if (!document.fullscreenElement) {
            this.screenMode('default');
        }
    }

    private teamsModeUpdateTile() {
        Utils.formatedTilesByMode(this.options, this.groups, this.list);
    }

    private html2canavasImagesCacheUpdate() {
        this.exportImageDisabled = true;
        setTimeout(() => {
            this.global
                .imagesCache(this.options, this.groups, this.list)
                .then(cache => Object.assign(this.imagesCache, cache))
                .finally(() => {
                    this.exportImageDisabled = false;
                    this.exportImageLoading = false;
                });
        });
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
            banner: this.classement?.banner,
            linkId: this.classement?.linkId,
            dateCreate: Utils.toISODate(this.classement?.dateCreate, true),
            dateChange: Utils.toISODate(this.classement?.dateChange),
        };
    }

    private getFileName(): Data {
        return this.options.title.trim() || this.translate.instant('list.title.undefined');
    }

    private downloadImage(data: string, filename: string) {
        Utils.downloadFile(data, filename);
    }

    private addIds() {
        // for groups
        this.groups.forEach(group => {
            if (!(group.list as any).id) {
                // add ids to identify lists
                (group.list as any).type = `group`;
                (group.list as any).id = `group-${this.randomNumber()}`;
            }
            group.list.forEach(tile => {
                if (!tile.id) {
                    // add ids to identify tiles
                    tile.id = `tile-${this.randomNumber()}`;
                }
            });
        });

        // for list
        if (!(this.list as any).id) {
            // add ids to identify lists
            (this.list as any).type = `list`;
            (this.list as any).id = 'list';
        }
        this.list.forEach(tile => {
            if (!tile.id) {
                // add ids to identify tiles
                tile.id = `tile-${this.randomNumber()}`;
            }
        });
    }

    private listIsType(list: FileString[], group: string): boolean {
        return (list as any).type === group;
    }

    private randomNumber() {
        return `${Math.round(Math.random() * 999_999_999)}`.padStart(9, '0');
    }

    private getClassementId(classement: Classement) {
        return classement!.linkId || classement!.rankingId;
    }
}
