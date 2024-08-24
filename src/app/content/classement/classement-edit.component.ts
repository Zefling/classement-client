import {
    CdkDragDrop,
    CdkDragMove,
    Point,
    copyArrayItem,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    DoCheck,
    ElementRef,
    HostBinding,
    HostListener,
    OnDestroy,
    viewChild,
    viewChildren,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';

import html2canvas from '@html2canvas/html2canvas';
import { TranslocoService } from '@jsverse/transloco';

import { Coloration } from 'coloration-lib';
import { Subject, debounceTime, first } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ImportJsonEvent } from 'src/app/components/import-json/import-json.component';
import { MessageService, MessageType } from 'src/app/components/info-messages/info-messages.component';
import { CdkDragElement } from 'src/app/directives/drag-element.directive';
import {
    Classement,
    Data,
    FileString,
    FileType,
    FormattedGroup,
    GroupOption,
    ImageCache,
    Options,
    PreferenceLineOption,
    ScreenMode,
    ThemesNames,
} from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { FileFormatExport, GlobalService, TypeFile } from 'src/app/services/global.service';
import { Logger, LoggerLevel } from 'src/app/services/logger';
import { OptimiseImageService } from 'src/app/services/optimise-image.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';
import { environment } from 'src/environments/environment';

import { ContextMenuItem } from 'src/app/components/context-menu/context-menu.component';
import { APIImdbService } from 'src/app/services/api.imdb.service';
import { MemoryService } from 'src/app/services/memory.service';
import {
    defaultGroup,
    defaultOptions,
    defaultTheme,
    themesAxis,
    themesBingo,
    themesIceberg,
    themesLists,
} from './classement-default';
import { ClassementEditImageComponent } from './classement-edit-image.component';
import { ClassementLoginComponent } from './classement-login.component';
import { ExternalImdbComponent } from './external.imdb.component';
import { HelpAxisComponent } from './help/help.axis.component';
import { HelpBingoComponent } from './help/help.bingo.component';
import { HelpIcebergComponent } from './help/help.iceberg.component';
import { HelpTeamsComponent } from './help/help.teams.component';
import { HelpTierListComponent } from './help/help.tierlist.component';

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

    groups: FormattedGroup[] = [];
    list: FileType[] = [];
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

    imdbActive = false;

    inputTexts = '';

    @HostBinding('class.option-reduce')
    get optionReduce() {
        return this.lineOption === 'reduce';
    }

    @HostBinding('class.option-hidden')
    get optionHidden() {
        return this.lineOption === 'hidden';
    }

    @HostBinding('class.no-animation')
    get noAnimation() {
        return this.options?.mode === 'iceberg' || this.options?.mode === 'axis';
    }

    image = viewChild.required<ElementRef<HTMLDivElement>>('image');
    currentList = viewChild<ElementRef<HTMLDivElement>>('currentList');
    dialogImage = viewChild.required<DialogComponent>('dialogImage');
    dialogImport = viewChild.required<DialogComponent>('dialogImport');
    dialogOptimise = viewChild.required<DialogComponent>('dialogOptimise');
    dialogSaveServer = viewChild.required<DialogComponent>('dialogSaveServer');
    dialogDerivatives = viewChild.required<DialogComponent>('dialogDerivatives');
    dialogRankingDiff = viewChild.required<DialogComponent>('dialogRankingDiff');
    dialogGroupOption = viewChild.required<DialogComponent>('dialogGroupOption');
    dialogTexts = viewChild.required<DialogComponent>('dialogTexts');
    editImage = viewChild.required<ClassementEditImageComponent>(ClassementEditImageComponent);
    login = viewChild.required<ClassementLoginComponent>(ClassementLoginComponent);
    imdb = viewChild.required<ExternalImdbComponent>(ExternalImdbComponent);
    tiles = viewChildren<CdkDragElement>(CdkDragElement);

    contextMenu: ContextMenuItem<{ item: FileType; group: FormattedGroup; index: number }>[] = [];

    private _canvas?: HTMLCanvasElement;
    private _sub = Subscriptions.instance();
    private _optionsCache?: Options;
    private _inputFile!: HTMLInputElement;
    private _detectChange = new Subject<void>();

    constructor(
        private readonly dbService: DBService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly translate: TranslocoService,
        private readonly global: GlobalService,
        private readonly messageService: MessageService,
        private readonly userService: APIUserService,
        private readonly classementService: APIClassementService,
        private readonly optimiseImage: OptimiseImageService,
        private readonly logger: Logger,
        private readonly cd: ChangeDetectorRef,
        private readonly location: Location,
        private readonly preferencesService: PreferencesService,
        private readonly imdbService: APIImdbService,
        private readonly memory: MemoryService,
    ) {
        this.updateTitle();

        this.contextMenu.push(
            {
                icon: 'icon-down',
                label: 'generator.context.menu.back.list',
                action: data => {
                    this.removeFromGroup(data.group, data.index);
                },
            },
            {
                icon: 'icon-edit-2',
                label: 'generator.context.menu.edit',
                action: data => {
                    this.openTileInfo(data.item as FileString);
                },
            },
            {
                icon: 'icon-remove',
                label: 'generator.context.menu.remove',
                action: data => {
                    this.currentTile = data.item as FileString;
                    this.deleteCurrent();
                },
            },
        );

        this._sub.push(
            this.route.params.subscribe(params => {
                if (this.preferencesService.hasInit) {
                    this.initWithParams(params);
                    this.initAPI();
                } else {
                    this.preferencesService.onInit.pipe(first()).subscribe(() => {
                        this.initWithParams(params);
                        this.initAPI();
                    });
                }
            }),
            this.preferencesService.onInit.subscribe(() => {
                this.initAPI();
            }),
            this.preferencesService.onChange.subscribe(() => {
                this.initAPI();
            }),
            this.imdbService.onChange.subscribe(() => {
                this.initAPI();
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
            this.translate.langChanges$.subscribe(() => {
                this.updateTitle();
            }),
            toObservable(this.global.withChange).subscribe(withChange => {
                if (
                    this.options &&
                    !Utils.objectsAreSame(this._optionsCache, this.options, ['autoSave', 'showAdvancedOptions'])
                ) {
                    this.memory.addUndo(this);
                }
            }),
        );
    }

    updateTitle() {
        this.global.setTitle('menu.edit');
    }

    initAPI() {
        this.imdbActive = this.imdbService.isActive();
    }

    initWithParams(params: Params) {
        this.lockCategory = false;

        if (params['id'] && params['id'] !== 'new') {
            const fork = params['mode'] === 'fork';
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

            // reset all + theme selection
            let defaultOptions: Options | undefined = undefined;
            if (params['mode']) {
                let themes: ThemesNames[] | undefined = undefined;
                switch (params['mode']) {
                    case 'iceberg':
                        themes = themesIceberg;
                        break;
                    case 'axis':
                        themes = themesAxis;
                        break;
                    case 'bingo':
                        themes = themesBingo;
                        break;
                    case 'default':
                    case 'teams':
                        themes = themesLists;
                        break;
                }
                this.location.replaceState('/edit/new');
                if (themes) {
                    defaultOptions = Utils.jsonCopy(defaultTheme(themes[0])).options;
                    defaultOptions.mode = params['mode'];
                }
            }
            if (!defaultOptions) {
                defaultOptions = Utils.jsonCopy(defaultTheme(this.preferencesService.preferences.theme).options);
            }
            this.new = true;
            this.options = {
                ...defaultOptions,
                ...(this.global.jsonTmp?.options || defaultOptions),
                ...{ showAdvancedOptions: false },
            };

            this.groups = this.global.jsonTmp?.groups || Utils.jsonCopy(defaultGroup);
            this.list = this.global.jsonTmp?.list || [];
            this.addIds();
            this.id = undefined;
            this.classement = undefined;
            this.global.jsonTmp = undefined;

            this.exportImageLoading = false;
            this.memory.reset();
            this.resetCache();
            this.helpInit();

            if (params['mode'] === 'bingo') {
                this.groupsControl(this.groups, this.options);
            }
        }
    }

    groupsControl(groups: FormattedGroup[], options: Options) {
        // total line control
        const limitY = options.sizeY || 5;
        if (groups.length > limitY) {
            groups.splice(limitY);
        } else if (groups.length < limitY) {
            for (let i = groups.length; i < limitY; i++) {
                groups.push({ name: 'X', bgColor: '#FFF', txtColor: '#000', list: [] });
            }
        }

        // total col control
        const limitX = options.sizeX || 5;
        for (let line of groups) {
            for (let i = 0; i < limitX; i++) {
                if (line.list[i] === undefined) {
                    line.list[i] = null;
                }
            }
        }
    }

    loadLocalClassement() {
        this.dbService
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
                if (data.infos.options.groups) {
                    this.options.groups = data.infos.options.groups;
                }
                this.groups = data.data.groups;
                this.list = data.data.list;
                this.addIds();
                this.global.fixImageSize(this.groups, this.list);
                this.html2canvasImagesCacheUpdate();
                this.size = this.optimiseImage.size(this.list, this.groups, this.options.mode).size;
                this.memory.reset();
                this.resetCache();
                this.helpInit();
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
        if (classement.data.options.groups) {
            this.options.groups = classement.data.options.groups;
        }
        this.groups = classement.data.groups;
        this.list = classement.data.list;
        this.teamsModeUpdateTile();
        this.addIds();
        this.lockCategory = !classement.parent || classement.user !== this.userService.user?.username;
        this.html2canvasImagesCacheUpdate();

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
        this.memory.reset();
        this.resetCache();
        this.helpInit();
    }

    loadDerivativeClassement(classement: Classement) {
        this.router.navigate(['edit', Utils.getClassementId(classement)]);
        this.dialogDerivatives().close();
    }

    ngDoCheck() {
        if (!this.options) {
            return;
        }

        this.lineOption = this.preferencesService.preferences.lineOption;

        this.global.updateVarCss(this.options, this.imagesCache);
        this.nameOpacity = this.global.getValuesFromOptions(this.options).nameOpacity;

        // fix category with select2
        this.options.category ??= '';

        if (
            this.options &&
            !Utils.objectsAreSame(this._optionsCache, this.options, ['autoSave', 'showAdvancedOptions'])
        ) {
            this.globalChange();
            this.logger.log('Option change');
            if (!this.global.withChange()) {
                this.change();
            }
            this._optionsCache = Utils.jsonCopy(this.options);
        }

        this.hasItems = this.list.length > 0 || this.groups.some(e => e.list.length > 0);

        this.shareUrl =
            this.apiActive && this.classement?.rankingId
                ? `${location.protocol}//${location.host}/~${Utils.getClassementId(this.classement)}`
                : '';

        const currentList = this.currentList()?.nativeElement;
        if (currentList) {
            this.scrollArrows = currentList.scrollWidth > currentList.clientWidth;
        }
    }

    helpInit() {
        switch (this.options.mode) {
            case 'teams':
                this.global.changeHelpComponent(HelpTeamsComponent);
                break;
            case 'iceberg':
                this.global.changeHelpComponent(HelpIcebergComponent);
                break;
            case 'axis':
                this.global.changeHelpComponent(HelpAxisComponent);
                break;
            case 'bingo':
                this.global.changeHelpComponent(HelpBingoComponent);
                break;
            default:
                this.global.changeHelpComponent(HelpTierListComponent);
                break;
        }
    }

    trackByFnFileString(_index: number, item: FileType) {
        return item?.url || item?.id;
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
            ? Math.round(
                  Math.min(
                      this.options.itemMaxWidth ?? 300,
                      ((item.width || 100) / (item.height || 100)) * this.options.itemHeight,
                  ),
              )
            : null;
    }

    detectChanges() {
        this._detectChange.next();
    }

    ngOnDestroy() {
        this._sub.clear();
        this.global.changeHelpComponent();
    }

    @HostListener('window:beforeunload', ['$event'])
    canDeactivate(event: BeforeUnloadEvent): void {
        // apply logic
        // if blocking is required -> show message to the user
        // if the user decide to stay in the page:
        if (this.global.withChange()) {
            event.returnValue = true;
        }
    }

    showDerivative() {
        this.dialogDerivatives().open();
    }

    showRankingDiff() {
        if (this.classement) {
            //this.loading = true;
            this.classementService
                .getClassementsByTemplateId(this.classement.templateId)
                .then(classements => {
                    this.diff = [];
                    // current tiles
                    const list: FileType[] = [];
                    list.push(...this.list);
                    this.groups.forEach(e => list.push(...e.list));

                    if (classements?.length) {
                        classements.forEach(classement => {
                            const listCompare = [];
                            listCompare.push(...classement.data.list);
                            classement.data.groups.forEach(e => listCompare.push(...e.list));

                            listCompare.forEach(tile => {
                                if (tile) {
                                    // compare with exist
                                    for (const item of list) {
                                        if (
                                            item &&
                                            (item.url === tile.url || (!item.url && item.title == tile.title))
                                        ) {
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
                                }
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

            this.dialogRankingDiff().open();
        }
    }

    addTile(tile: FileString) {
        this.list.push(tile);
        this.addIds();
        this.diff!.splice(this.diff!.indexOf(tile), 1);
    }

    createTile(event: MouseEvent) {
        const numb = `${Math.round(Math.random() * 9_999)}`.padStart(4, '0');
        // layerX/Y is not standard, but is the real position in zone for all browser
        this.groups[0].list.push({
            id: `${new Date().getTime()}`,
            title: this.translate.translate('new') + numb,
            name: '',
            size: 0,
            realSize: 0,
            type: '',
            date: 0,
            x: (event as any)['layerX'] - 30,
            y: (event as any)['layerY'] - 15,
        });
    }

    resetCache() {
        this._optionsCache = Utils.jsonCopy(this.options);
        this.global.withChange.set(0);
        this.memory.addUndo(this);
    }

    toTemplateNavigation() {
        this.router.navigate(['navigate', 'template', this.classement!.templateId]);
    }

    copyLink() {
        Utils.clipboard(this.shareUrl)
            .then(() => this.messageService.addMessage(this.translate.translate('generator.ranking.copy.link.success')))
            .catch(_e =>
                this.messageService.addMessage(this.translate.translate('generator.ranking.copy.link.error'), {
                    type: MessageType.error,
                }),
            );
    }

    show() {
        this.router.navigate([`/~${Utils.getClassementId(this.classement!)}`]);
    }

    drop(event: CdkDragDrop<{ list: FileType[]; index: number }>) {
        const previousList = event.previousContainer.data.list;
        const targetList = event.container.data.list;
        const indexFrom = event.previousIndex;
        const indexTarget = event.currentIndex;
        const indexPreviousData = event.previousContainer.data.index;
        const indexTargetData = event.container.data.index;

        if (previousList === targetList) {
            switch (this.options.mode) {
                case 'bingo':
                    if (indexTargetData === -1 || (indexTargetData > -1 && !targetList[indexTargetData])) {
                        moveItemInArray(
                            targetList,
                            indexPreviousData > -1 ? indexPreviousData : indexFrom,
                            indexTargetData > -1 ? indexTargetData : indexTarget,
                        );
                        if (indexTargetData > -1 && indexPreviousData > -1) {
                            moveItemInArray(
                                targetList,
                                indexTargetData + (indexTargetData > indexPreviousData ? -1 : 1),
                                indexPreviousData,
                            );
                        }
                    }
                    break;
                default:
                    moveItemInArray(targetList, indexFrom, indexTarget);
            }
            this.globalChange();
        } else {
            switch (this.options.mode) {
                case 'teams':
                    if (
                        Utils.listIsType(previousList, 'list') &&
                        Utils.listIsType(targetList, 'group') &&
                        !targetList.find(tile => tile!.id === previousList[indexFrom]!.id)
                    ) {
                        copyArrayItem(previousList, targetList, indexFrom, indexTarget);
                    } else if (Utils.listIsType(previousList, 'group') && Utils.listIsType(targetList, 'group')) {
                        if (!targetList.find(tile => tile!.id === previousList[indexFrom]!.id)) {
                            transferArrayItem(previousList, targetList, indexFrom, indexTarget);
                        } else {
                            previousList.splice(indexFrom, 1);
                        }
                    } else if (Utils.listIsType(previousList, 'group') && Utils.listIsType(targetList, 'list')) {
                        previousList.splice(indexFrom, 1);
                    }
                    this.globalChange();
                    break;
                case 'iceberg':
                case 'axis':
                    const item = previousList[indexFrom]!;
                    const eventLayer = event.event as any;

                    if (eventLayer.target.id === 'zone') {
                        const size = this.optimiseImage.resizeDimension(
                            item.width || 0,
                            item.height || 0,
                            this.options.itemWidthAuto
                                ? this.options.itemMaxWidth || 300
                                : this.options.itemWidth || 300,
                            this.options.itemHeightAuto
                                ? this.options.itemMaxHeight || 300
                                : this.options.itemHeight || 300,
                        );

                        // when the target is the drop-zone
                        item.x = eventLayer.layerX - (size.width || 0) / 2;
                        item.y = eventLayer.layerY - (size.height || 0) / 2;
                    } else if (eventLayer.target.id === 'list') {
                        // when the target is the drag origin list (I don't know why...)
                        const zone = window.document.getElementById('zone') as HTMLDivElement;
                        item.x = eventLayer.layerX;
                        item.y = zone.clientHeight + eventLayer.layerY;
                    }

                    item.x = Math.max(0, item.x || 0);
                    item.y = Math.max(0, item.y || 0);

                    transferArrayItem(previousList, targetList, indexFrom, this.groups[0].list.length);
                    this.globalChange();
                    break;
                case 'bingo':
                    if (indexTargetData === -1 || (indexTargetData > -1 && !targetList[indexTargetData])) {
                        transferArrayItem(
                            previousList,
                            targetList,
                            indexPreviousData > -1 ? indexPreviousData : indexFrom,
                            indexTargetData > -1 ? indexTargetData : indexTarget,
                        );
                        if (indexTargetData > -1) {
                            targetList.splice(indexTargetData + 1, 1);
                        }
                        if (indexPreviousData > -1) {
                            previousList.splice(indexPreviousData, 0, null);
                        }
                    }
                    this.globalChange();
                    break;
                default:
                    transferArrayItem(previousList, targetList, indexFrom, indexTarget);
                    this.globalChange();
            }
        }

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

    addTextsDialog() {
        this.dialogTexts().open();
    }

    closeTexts() {
        this.inputTexts = '';
        this.dialogTexts().close();
    }

    addTexts() {
        this.global.addTexts(this.inputTexts);
        this.closeTexts();
    }

    globalChange() {
        this.global.withChange.update(value => value + 1);
        this.memory.addUndo(this);
    }

    upLine(index: number) {
        this.groups.splice(index - 1, 0, this.groups.splice(index, 1)[0]);
        this.addIds();
        this.globalChange();
        this.change();

        this.currentGroup = {
            group: this.groups[index - 1],
            indexGrp: index - 1,
            first: index - 1 === 0,
            last: false,
        };
    }

    downLine(index: number) {
        this.groups.splice(index + 1, 0, this.groups.splice(index, 1)[0]);
        this.addIds();
        this.globalChange();
        this.change();

        this.currentGroup = {
            group: this.groups[index + 1],
            indexGrp: index + 1,
            first: false,
            last: index + 1 === this.groups.length - 1,
        };
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

    deleteCurrent() {
        if (this.currentTile) {
            const index = this.list.indexOf(this.currentTile);
            if (index >= 0) {
                this.list.splice(index, 1);
            }
            this.groups.forEach(group => {
                const index = group.list.findIndex(tile => tile?.id === this.currentTile!.id);
                if (index !== -1) {
                    group.list.splice(index, 1);
                }
            });
            this.globalChange();
            this.updateSize();
            this.change();
        }
    }

    stopEvent(event: Event) {
        if (event instanceof MouseEvent && event.button === 1) {
            // prevent copy on Linux
            event.stopPropagation();
            event.preventDefault();
        }
    }

    removeFromGroup(group: FormattedGroup, index: number) {
        const item =
            this.options.mode !== 'bingo' ? group.list.splice(index, 1)[0] : group.list.splice(index, 1, null)[0];

        if (item) {
            item.x = 0;
            item.y = 0;
        }
        if (this.options.mode !== 'teams') {
            this.list.push(item);
        }
        this.globalChange();
        this.change();
    }

    initItem(element: CdkDragElement, pos: Point) {
        element.freeDragPosition = pos;
        element.ngAfterViewInit();
    }

    moveItem(event: CdkDragMove<any>, item: FileString, _element: CdkDragElement) {
        // position of tile is not public (why ?)
        const source = event.source._dragRef['_activeTransform'];
        item.x = source.x;
        item.y = source.y;
    }

    moveItemEnd() {
        this.globalChange();
        this.change();
    }

    removeItem(index: number) {
        const removeTile = this.list.splice(index, 1);
        if (removeTile[0] && this.options.mode === 'teams') {
            this.groups.forEach(group => {
                const index = group.list.findIndex(tile => tile?.id === removeTile[0]!.id);
                if (index !== -1) {
                    group.list.splice(index, 1);
                }
            });
        }
        this.globalChange();
        this.updateSize();
        this.change();
    }

    updateGroupOption(group: GroupOption) {
        this.currentGroup = group;
        this.dialogGroupOption().open();
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
            name: this.translate.translate('New'),
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

    async exportImage() {
        this.dialogImage().open();
        const canvas = await html2canvas(document.getElementById('html2canvas-element') as HTMLElement, {
            logging: false,
            allowTaint: true,
            scale: 2,
        });
        const element = this.image().nativeElement;
        element.innerHTML = '';
        element.appendChild(canvas);
        this._canvas = canvas;
    }

    saveImage(type: FileFormatExport) {
        this.global.saveImage(this._canvas, this.getFileName(), type);
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
        for (const line of this.groups) {
            line.list.forEach(item => {
                if (item) {
                    delete item.x;
                    delete item.y;
                }
            });
            if (this.options.mode !== 'teams') {
                this.list.push(...line.list);
            }
            line.list = [];
        }

        this.list = this.list.filter(e => e);

        this.addIds();
        this.messageService.addMessage(this.translate.translate('message.reset.groups'));
    }

    @HostListener('window:keydown.control.s', ['$event'])
    keySaveLocal(event: Event) {
        if (this.hasItems) {
            this.saveLocal();
        }
        event.preventDefault();
    }

    saveLocal(silence: boolean = false, route: boolean = true) {
        this.dbService.saveLocal(this.getData()).then(
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
                    this.messageService.addMessage(this.translate.translate('message.save.success'));
                }
                this.global.updateList();
            },
            _ => {
                this.messageService.addMessage(this.translate.translate('message.save.failed'), {
                    type: MessageType.error,
                });
            },
        );
    }

    saveServer() {
        if (this.logged) {
            this.dialogSaveServer().open();
        } else {
            this.login().open();
        }
    }

    updateAfterServerSave(action: { type: 'save' | 'remove'; classement: Classement }) {
        const classement = action.classement;
        let reset = false;

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

        this.html2canvasImagesCacheUpdate();

        if (classement.localId) {
            if (action.type === 'save') {
                // persist data
                this.saveLocal(false, false);
            } else if (action.type === 'remove') {
                this.dbService.delete(classement.localId);
                reset = true;
            }
        } else {
            reset = true;
        }

        if (navigate) {
            this.id = classement.rankingId;
            reset = true;
            this.updateSize();
            this.location.replaceState('/edit/' + Utils.getClassementId(classement));
        }
        if (reset) {
            this.memory.reset();
            this.resetCache();
        }
    }

    @HostListener('window:keydown.control.z', ['$event'])
    undo(event: Event) {
        this.memory.undo(this);
        this.undoRedoUpdate(event);
    }

    @HostListener('window:keydown.control.u', ['$event'])
    redo(event: Event) {
        this.memory.redo(this);
        this.undoRedoUpdate(event);
    }

    private undoRedoUpdate(event: Event) {
        this._detectChange.next();
        event.preventDefault();

        setTimeout(() => {
            if (this.options.mode === 'axis' || this.options.mode === 'iceberg') {
                this.tiles().forEach(element => {
                    element.freeDragPosition = element.data;
                    element.ngAfterViewInit();
                });
            }
        });
    }

    @HostListener('window:keydown.control.e', ['$event'])
    keySaveJson(event: Event) {
        if (this.hasItems) {
            this.saveJson();
        }
        event.preventDefault();
    }

    saveJson() {
        if (this.hasItems) {
            Utils.downloadFile(JSON.stringify(this.getData()), this.getFileName() + '.json', 'text/plain');
        }
    }

    importJson(event: ImportJsonEvent) {
        switch (this.new && event.action === 'new' ? 'replace' : event.action) {
            case 'replace': {
                this.groups = event.data?.groups!;
                this.list = event.data?.list!;
                this.addIds();
                this.options = { ...defaultOptions, ...event.data?.options! };
                this.messageService.addMessage(this.translate.translate('message.json.read.replace'));
                this.html2canvasImagesCacheUpdate();
                break;
            }
            case 'new': {
                this.global.jsonTmp = event.data;
                this.router.navigate(['edit', 'new']);
                this.messageService.addMessage(this.translate.translate('message.json.read.new'));
                break;
            }
        }
        this.dialogImport().close();
    }

    screenMode(mode: 'default' | 'enlarge' | 'fullscreen', div?: HTMLDivElement) {
        if (div) {
            if (mode === 'fullscreen') {
                div.requestFullscreen();
            } else if (this.classScreenMode === 'fullscreen') {
                document.exitFullscreen();
            }
        }
        this.classScreenMode = mode;
    }

    openTileInfo(item: FileString) {
        this.currentTile = item;
        this.editImage().open();
    }

    @HostListener('window:fullscreenchange')
    screenModeFullscreen() {
        if (!document.fullscreenElement) {
            this.screenMode('default');
        }
    }

    private teamsModeUpdateTile() {
        Utils.formattedTilesByMode(this.options, this.groups, this.list);
    }

    private html2canvasImagesCacheUpdate() {
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

    private getFileName(): string {
        return this.options.title.trim() || this.translate.translate('list.title.undefined');
    }

    addIds() {
        // for groups
        this.groups.forEach(group => {
            if (!(group.list as any).id) {
                // add ids to identify lists
                (group.list as any).type = `group`;
                (group.list as any).id = `group-${Utils.randomNumber()}`;
            }
            group.list.forEach(tile => {
                if (tile && !tile.id) {
                    // add ids to identify tiles
                    tile.id = `tile-${Utils.randomNumber()}`;
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
            if (tile && !tile.id) {
                // add ids to identify tiles
                tile.id = `tile-${Utils.randomNumber()}`;
            }
        });
    }
}
