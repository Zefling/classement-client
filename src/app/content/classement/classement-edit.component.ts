import {
    CdkDrag,
    CdkDragDrop,
    CdkDragMove,
    CdkDropList,
    CdkDropListGroup,
    Point,
    copyArrayItem,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Location, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    computed,
    effect,
    inject,
    signal,
    viewChild,
    viewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import html2canvas from '@html2canvas/html2canvas';
import {
    ContextMenuItem,
    Logger,
    LoggerLevel,
    MagmaClickEnterDirective,
    MagmaClickOutsideDirective,
    MagmaColorPicker,
    MagmaContextMenu,
    MagmaDialog,
    MagmaEllipsisButton,
    MagmaEllipsisItemComponent,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputTextarea,
    MagmaLoader,
    MagmaLoaderMessage,
    MagmaMessageType,
    MagmaMessages,
    MagmaNgInitDirective,
    MagmaNgModelChangeDebouncedDirective,
    MagmaSpinner,
    MagmaStopPropagationDirective,
    MagmaTooltipDirective,
    Subscriptions,
    clipboardWrite,
    downloadFile,
    jsonCopy,
    objectsAreSame,
    randomNumber,
    toISODate,
} from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import Bowser from 'bowser';
import { first } from 'rxjs';

import {
    defaultGroup,
    defaultOptions,
    defaultTheme,
    themesAxis,
    themesBingo,
    themesIceberg,
    themesLists,
} from './classement-default';
import { ClassementOptionsComponent } from './classement-options.component';
import { ClassementSaveServerComponent } from './classement-save-server.component';
import { ClassementClearComponent } from './dialogs/classement-clear.component';
import { ClassementDerivativesComponent } from './dialogs/classement-derivatives.component';
import { ClassementEditImageComponent } from './dialogs/classement-edit-image.component';
import { ClassementGroupOptionComponent } from './dialogs/classement-group-option.component';
import { ClassementImportTileComponent } from './dialogs/classement-import-tile.component';
import { ClassementLoginComponent } from './dialogs/classement-login.component';
import { ClassementOptimiseComponent } from './dialogs/classement-optimise.component';
import { ClassementRankingDiffComponent } from './dialogs/classement-ranking-diff.component';
import { ClassementTextsComponent } from './dialogs/classement-texts.component';
import { ExternalAnilistComponent } from './external/external.anilist.component';
import { ExternalTmdbComponent } from './external/external.tmdb.component';
import { HelpAxisComponent } from './help/help.axis.component';
import { HelpBingoComponent } from './help/help.bingo.component';
import { HelpColumnsComponent } from './help/help.columns.component';
import { HelpIcebergComponent } from './help/help.iceberg.component';
import { HelpTeamsComponent } from './help/help.teams.component';
import { HelpTierListComponent } from './help/help.tierlist.component';

import { ImportJsonComponent, ImportJsonEvent } from '../../components/import-json/import-json.component';
import { SeeClassementComponent } from '../../components/see-classement/see-classement.component';
import { ZoneAreaComponent } from '../../components/zone-area/zone-area.component';
import { ZoneAxisComponent } from '../../components/zone-axis/zone-axis.component';
import { CdkDragElement } from '../../directives/drag-element.directive';
import { DropImageDirective } from '../../directives/drop-image.directive';
import { CdkDropZone } from '../../directives/dropzone.directive';
import { RemoveTileDirective } from '../../directives/remove-tile.directive';
import {
    Classement,
    Data,
    FileStream,
    FileString,
    FileType,
    FormattedGroup,
    GroupOption,
    ImageCache,
    Options,
    PreferenceLineOption,
    ScreenMode,
    ThemesNames,
} from '../../interface/interface';
import { FileSizePipe } from '../../pipes/file-size';
import { APIClassementService } from '../../services/api.classement.service';
import { APITmdbService } from '../../services/api.tmdb.service';
import { APIUserService } from '../../services/api.user.service';
import { DBService } from '../../services/db.service';
import { EditKeyBoardService } from '../../services/edit.keyboard.service';
import { FileFormatExport, GlobalService, TypeFile } from '../../services/global.service';
import { MemoryService } from '../../services/memory.service';
import { OptimiseImageService } from '../../services/optimise-image.service';
import { PreferencesService } from '../../services/preferences.service';
import { color, mixColor, randomizeArray } from '../../tools/function';
import { Utils } from '../../tools/utils';

const browser = Bowser.getParser(window.navigator.userAgent);

@Component({
    selector: 'classement-edit',
    templateUrl: './classement-edit.component.html',
    styleUrls: ['./classement-edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        // libs
        NgClass,
        FormsModule,
        TranslocoPipe,
        CdkDropListGroup,
        CdkDragElement,
        CdkDropList,
        CdkDrag,
        CdkDropZone,
        // magma
        MagmaContextMenu,
        MagmaNgInitDirective,
        MagmaTooltipDirective,
        MagmaDialog,
        MagmaNgModelChangeDebouncedDirective,
        MagmaInput,
        MagmaInputCheckbox,
        MagmaInputTextarea,
        MagmaColorPicker,
        MagmaClickEnterDirective,
        MagmaClickOutsideDirective,
        MagmaLoader,
        MagmaLoaderMessage,
        MagmaSpinner,
        MagmaStopPropagationDirective,
        MagmaEllipsisButton,
        MagmaEllipsisItemComponent,
        // internal
        RemoveTileDirective,
        DropImageDirective,
        ZoneAreaComponent,
        ZoneAxisComponent,
        SeeClassementComponent,
        ImportJsonComponent,
        ClassementOptionsComponent,
        ClassementOptimiseComponent,
        ClassementSaveServerComponent,
        ClassementEditImageComponent,
        ClassementLoginComponent,
        ClassementImportTileComponent,
        ClassementClearComponent,
        ClassementDerivativesComponent,
        ClassementGroupOptionComponent,
        ClassementRankingDiffComponent,
        ClassementTextsComponent,
        ExternalTmdbComponent,
        ExternalAnilistComponent,
        FileSizePipe,
    ],
    host: {
        '[class.option-reduce]': 'optionReduce',
        '[class.option-hidden]': 'optionHidden',
        '[class.no-animation]': 'noAnimation',
        '[class.stream-mode]': 'streamMode',
    },
})
export class ClassementEditComponent implements OnDestroy, OnInit {
    protected readonly dbService = inject(DBService);
    protected readonly router = inject(Router);
    protected readonly route = inject(ActivatedRoute);
    protected readonly translate = inject(TranslocoService);
    protected readonly global = inject(GlobalService);
    protected readonly mgMessage = inject(MagmaMessages);
    protected readonly userService = inject(APIUserService);
    protected readonly classementService = inject(APIClassementService);
    protected readonly optimiseImage = inject(OptimiseImageService);
    protected readonly logger = inject(Logger);
    protected readonly location = inject(Location);
    protected readonly preferencesService = inject(PreferencesService);
    protected readonly tmdbService = inject(APITmdbService);
    protected readonly memory = inject(MemoryService);
    protected readonly keyboard = inject(EditKeyBoardService);
    protected readonly cd = inject(ChangeDetectorRef);

    color = color;

    new = false;
    id?: string;

    classement?: Classement;

    derivatives?: Classement[];

    classementsSearch?: Classement[];

    groups: FormattedGroup[] = [];
    list: FileType[] = [];
    lockCategory = false;

    options!: Options;
    nameOpacity!: number;
    currentGroup?: GroupOption;

    changeTimer: any[] = [];

    logged = false;

    hasItems = signal(false);

    exportImageLoading = false;
    exportImageDisabled = false;
    loading = signal('');

    size = 0;

    shareUrl = '';

    scrollArrows = false;

    imagesCache: ImageCache = {};

    classScreenMode: ScreenMode = 'default';
    lineOption: PreferenceLineOption = 'auto';

    modeApi = computed(() => this.global.withApi());
    currentTile?: FileString;

    altImage = '';

    tmdbActive = signal(false);
    anilistActive = signal(false);

    editField = signal(false);

    pinnedList = false;

    get optionReduce() {
        return this.lineOption === 'reduce';
    }

    get optionHidden() {
        return this.lineOption === 'hidden';
    }

    get noAnimation() {
        return this.options?.mode === 'iceberg' || this.options?.mode === 'axis';
    }

    get streamMode() {
        return this.options?.streamMode;
    }

    image = viewChild.required<ElementRef<HTMLDivElement>>('image');
    currentList = viewChild<ElementRef<HTMLDivElement>>('currentList');
    dialogImage = viewChild.required<MagmaDialog>('dialogImage');
    dialogImport = viewChild.required<MagmaDialog>('dialogImport');
    dialogOptimise = viewChild.required<MagmaDialog>('dialogOptimise');
    dialogSaveServer = viewChild.required<MagmaDialog>('dialogSaveServer');
    dialogGroupOption = viewChild.required<MagmaDialog>('dialogGroupOption');
    editImage = viewChild.required(ClassementEditImageComponent);
    login = viewChild.required(ClassementLoginComponent);
    tmdb = viewChild.required(ExternalTmdbComponent);
    anilist = viewChild.required<ExternalAnilistComponent>(ExternalAnilistComponent);
    tiles = viewChildren(CdkDragElement);
    seeClassement = viewChildren(SeeClassementComponent);

    contextMenu: ContextMenuItem<{ item: FileType; group: FormattedGroup; index: number }>[] = [];
    contextMenuList: ContextMenuItem<{ item: FileType; index: number }>[] = [];

    selectionTile: FileType = null;
    selectionGroup: FormattedGroup | null = null;
    selectionIndex: number | null = null;
    selectionDiv: HTMLDivElement | null = null;
    selectionDrag: CdkDragElement<any> | null = null;

    // export
    webp = browser.isEngine('blink') || browser.isEngine('gecko');

    private _canvas?: HTMLCanvasElement;
    private _sub = Subscriptions.instance();
    private _optionsCache?: Options;
    private _inputFile!: HTMLInputElement;

    constructor() {
        const global = this.global;
        const userService = this.userService;

        this.updateTitle();
        this.contextMenuGenerate();

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
                this.preferencesUpdate();
            }),
            this.preferencesService.onChange.subscribe(() => {
                this.preferencesUpdate();
            }),
            this.tmdbService.onChange.subscribe(() => {
                this.initAPI();
            }),
            global.onFileLoaded.subscribe(async file => {
                if (file.filter === TypeFile.image || file.filter === TypeFile.text) {
                    await this.addFile(file);
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
            global.onOptionChange.subscribe(() => {
                this.detectChanges();
            }),
            this.translate.langChanges$.subscribe(() => {
                this.updateTitle();
                this.contextMenuGenerate();
                this.detectChanges();
            }),
        );

        effect(() => {
            this.effect();
        });
    }

    effect() {
        if (!this.options) {
            return;
        }
        this.lineOption = this.preferencesService.preferences.lineOption;
        this.global.updateVarCss(this.options, this.imagesCache);
        this.nameOpacity = Math.round(this.options.nameBackgroundOpacity * 2.55);
        this.options.category ??= '';

        if (this.options && !objectsAreSame(this._optionsCache, this.options, ['autoSave', 'showAdvancedOptions'])) {
            this.memory.addUndo(this, 1000);
            this.updateActiveActions();
            this.logger.log('Option change');
            if (!this.global.withChange()) {
                this.change();
            }
            this._optionsCache = jsonCopy(this.options);
        }

        this.updateActiveActions();

        this.shareUrl =
            this.modeApi() && this.classement?.rankingId
                ? `${location.protocol}//${location.host}/~${Utils.getClassementId(this.classement)}`
                : '';

        const currentList = this.currentList()?.nativeElement;
        if (currentList) {
            this.scrollArrows = currentList.scrollWidth > currentList.clientWidth;
        }
    }

    updateActiveActions() {
        this.hasItems.set(this.list.length > 0 || this.groups.some(e => e.list.length > 0));
        this.cd.markForCheck();
    }

    protected preferencesUpdate() {
        this.initAPI();
        this.lineOption = this.preferencesService.preferences.lineOption;
        this.detectChanges();
    }

    contextMenuGenerate() {
        this.contextMenu = [
            {
                icon: 'icon-down',
                label: this.translate.translate('generator.context.menu.back.list'),
                action: data => {
                    this.removeFromGroup(data.group.list, data.index);
                },
            },
            {
                icon: 'icon-edit-2',
                label: this.translate.translate('generator.context.menu.edit'),
                action: data => {
                    this.openTileInfo(data.item as FileString);
                },
            },
            {
                icon: 'icon-remove',
                label: this.translate.translate('generator.context.menu.remove'),
                action: data => {
                    this.currentTile = data.item as FileString;
                    this.deleteCurrent();
                },
            },
        ];

        this.contextMenuList = [
            {
                icon: 'icon-edit-2',
                label: this.translate.translate('generator.context.menu.edit'),
                action: data => {
                    this.openTileInfo(data.item as FileString);
                },
            },
            {
                icon: 'icon-remove',
                label: this.translate.translate('generator.context.menu.remove'),
                action: data => {
                    this.currentTile = data.item as FileString;
                    this.deleteCurrent();
                },
            },
        ];
    }

    ngOnInit(): void {
        this.global.zoomActive.set(true);
    }

    ngOnDestroy(): void {
        this._sub.clear();
        this.global.changeHelpComponent();
        this.global.zoomActive.set(false);
    }

    private updateTitle() {
        this.global.setTitle('menu.edit');
    }

    private initAPI() {
        this.anilistActive.set(this.preferencesService.preferences.api.anilist);
    }

    private initWithParams(params: Params) {
        this.lockCategory = false;

        if (params['id'] && params['id'] !== 'new') {
            const fork = params['mode'] === 'fork';
            const forkOptions: string[] | undefined = params['options']?.split(',') ?? undefined;
            this.id = params['id'];
            this.exportImageLoading = true;
            this.exportImageDisabled = true;

            if (this.modeApi()) {
                this.logger.log('API mode');
                this.userService.loggedStatus().then(() => {
                    this.logged = this.userService.logged ?? false;
                    let classement = this.userService.user?.classements?.find(e => e.rankingId === this.id);
                    if (!classement) {
                        classement = this.userService.getByIdFormCache(this.id!);
                    }
                    if (classement) {
                        this.logger.log('loadServerClassement (user)');
                        this.loadServerClassement(classement, fork, forkOptions);
                    } else {
                        this.logger.log('no cache found');
                        this.classementService
                            .getClassement(this.id!)
                            .then(classement => {
                                this.logger.log('loadServerClassement (server)');
                                this.loadServerClassement(classement, fork, forkOptions);
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
            if (this.modeApi()) {
                this.userService.loggedStatus().then(() => {
                    this.logged = this.userService.logged ?? false;
                });
            }

            // reset all + theme selection
            let defaultOptions: Options | undefined = undefined;
            const paramMode = params['mode'];
            if (paramMode) {
                let themes: ThemesNames[] | undefined = undefined;
                switch (paramMode) {
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
                    case 'columns':
                        themes = themesLists;
                        break;
                }
                this.location.replaceState('/edit/new');
                if (themes) {
                    defaultOptions = jsonCopy(defaultTheme(themes[0])).options;
                    defaultOptions.mode = paramMode;
                }
            }
            if (!defaultOptions) {
                defaultOptions = jsonCopy(defaultTheme(this.preferencesService.preferences.theme).options);
                if (this.preferencesService.preferences.mode !== 'choice') {
                    defaultOptions.mode = this.preferencesService.preferences.mode;
                }
            }
            this.new = true;
            this.options = {
                ...defaultOptions,
                ...(this.global.jsonTmp?.options || defaultOptions),
                ...{ showAdvancedOptions: false },
            };

            if (this.global.lang === 'ar') {
                this.options.direction = 'rtl';
            }

            this.groups = this.global.jsonTmp?.groups || jsonCopy(defaultGroup);
            this.list = this.global.jsonTmp?.list || [];
            this.addIds();
            this.id = undefined;
            this.classement = undefined;
            this.global.jsonTmp = undefined;

            this.exportImageLoading = false;
            this.memory.reset();
            this.resetCache();
            this.helpInit();
            this.memory.addUndo(this);

            if (this.options.mode === 'bingo') {
                this.groupsControl(this.groups, this.options);
            }

            this.detectChanges();
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
                    ...jsonCopy(defaultTheme(this.preferencesService.preferences.theme).options),
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
                this.memory.addUndo(this);
                this.preferencesUpdate();
            })
            .catch(() => {
                this.logger.log('local not found');
                this.router.navigate(['edit', 'new']);
            });
    }

    private loadServerClassement(classement: Classement, fork: boolean, forkOptions: string[] | undefined) {
        this.classement = classement;
        this.options = {
            ...jsonCopy(defaultTheme(this.preferencesService.preferences.theme).options),
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

        if (this.logged) {
            this.classementService
                .getClassementsByTemplateId(this.classement?.templateId, this.userService.user?.id)
                .then(classements => {
                    this.derivatives = classements;
                });
        }

        if (fork) {
            if (forkOptions === undefined || forkOptions.includes('reset-groups')) {
                this.reset();
            }
            if (Array.isArray(forkOptions)) {
                this.list.forEach(item => this.resetByOptions(item, forkOptions));
                this.groups.forEach(group => group.list.forEach(item => this.resetByOptions(item, forkOptions)));
            }

            this.id = undefined;
            this.new = true;
            classement.linkId = '';
        }

        this.updateSize();
        this.memory.reset();
        this.resetCache();
        this.helpInit();
        this.memory.addUndo(this);
        this.preferencesUpdate();
    }

    private resetByOptions(item: FileType, forkOptions: string[]) {
        if (item) {
            if (!forkOptions.includes('txt-color')) {
                item.txtColor = undefined;
            }
            if (!forkOptions.includes('bg-color')) {
                item.bgColor = undefined;
            }
            if (!forkOptions.includes('annotations')) {
                item.annotation = undefined;
            }
        }
    }

    helpInit() {
        switch (this.options.mode) {
            case 'teams':
                this.global.changeHelpComponent(HelpTeamsComponent);
                break;
            case 'columns':
                this.global.changeHelpComponent(HelpColumnsComponent);
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
        return item?.url || item?.id || _index;
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
        this.cd.markForCheck();
        this.seeClassement().forEach(view => {
            view.markForCheck();
        });
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

    addTile(tile: FileString) {
        this.list.push(tile);
        this.addIds();
        this.updateActiveActions();
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

    private resetCache() {
        if (!objectsAreSame(this._optionsCache, this.options)) {
            this._optionsCache = jsonCopy(this.options);
            this.global.withChange.set(0);
            this.keyboard.clearSelection(this);
        }
    }

    toTemplateNavigation() {
        this.router.navigate(['navigate', 'template', this.classement!.templateId]);
    }

    copyLink() {
        clipboardWrite(this.shareUrl)
            .then(() => this.mgMessage.addMessage(this.translate.translate('generator.ranking.copy.link.success')))
            .catch(_e =>
                this.mgMessage.addMessage(this.translate.translate('generator.ranking.copy.link.error'), {
                    type: MagmaMessageType.error,
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
        this.updateActiveActions();
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
        this.memory.addUndo(this, 0);
        this.updateActiveActions();
    }

    upLine(index: number) {
        this.groups.splice(index - 1, 0, this.groups.splice(index, 1)[0]);
        this.addIds();
        this.globalChange();
        this.change();
        this.updateActiveActions();

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
        this.updateActiveActions();

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
        this.updateActiveActions();
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
                    if (this.options.mode === 'bingo') {
                        group.list[index] = null;
                    } else {
                        group.list.splice(index, 1);
                    }
                }
            });
            this.globalChange();
            this.updateSize();
            this.change();
            this.updateActiveActions();
        }
    }

    removeFromGroup(group: FileType[], index: number) {
        const item = this.options.mode !== 'bingo' ? group.splice(index, 1)[0] : group.splice(index, 1, null)[0];

        if (item) {
            item.x = 0;
            item.y = 0;
        }
        if (this.options.mode !== 'teams') {
            this.list.push(item);
        }
        this.globalChange();
        this.change();
        this.updateActiveActions();
    }

    stopEvent(event: Event) {
        this.keyboard.stopEvent(event);
    }

    selectMoveItem(event: KeyboardEvent, group: FileType[]) {
        this.keyboard.selectMoveItem(this, event, group);
    }

    selectItem(
        event: KeyboardEvent | MouseEvent | null = null,
        group: FormattedGroup | null = null,
        item: FileType = null,
        index: number | null = null,
        div: HTMLDivElement | null = null,
    ) {
        this.keyboard.selectItem(this, event, group, item, index, div);
    }

    selectItemByKey(
        event: KeyboardEvent,
        group: FormattedGroup | null,
        item: FileType,
        index: number | null = null,
        drag: CdkDragElement<any> | null = null,
    ) {
        this.keyboard.selectItemByKey(this, event, group, item, index, drag);
    }

    selectionGroupForItem(group: FormattedGroup | null, indexTarget: number | null = null) {
        this.keyboard.selectionGroupForItem(this, group, indexTarget);
    }

    clickZone(event: MouseEvent | KeyboardEvent) {
        if (this.selectionTile) {
            const rect = document.getElementById('zone')!.getBoundingClientRect();
            const index = this.list.indexOf(this.selectionTile);
            if (index !== -1) {
                const item = this.list.splice(index, 1)[0]!;
                const rctItem = document.getElementById(item.id)!.getBoundingClientRect();
                item.x = Math.min(
                    Math.max(0, ((event as any)?.clientX ?? 0) - rect.left - rctItem.width / 2),
                    rect.width - rctItem.width,
                );
                item.y = Math.min(
                    Math.max(0, ((event as any)?.clientY ?? 0) - rect.top - rctItem.height / 2),
                    rect.height - rctItem.height,
                );
                this.groups[0].list.push(item);
            }
        }
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

    async addFile(stream: FileStream) {
        let file = stream.file;

        if (this.preferencesService.preferences.nameCopy && !stream.add?.title) {
            file.title = (file.name || '').replace(/_/g, ' ').replace(/\.(\w+)$/, ''); // remove extension
        }

        const autoResize = this.preferencesService.preferences.autoResize;
        if (autoResize && autoResize !== 'origin' && file.url) {
            const [maxWidth, maxHeight] = autoResize.split('×');
            const fileOp = await this.optimiseImage.resize(file, +maxWidth, +maxHeight);
            if (fileOp.reduceFile) {
                file = fileOp.reduceFile;
            }
        }

        this.list.push(file);
        this.addIds();
        this.globalChange();
        this.change();
        this.updateActiveActions();
    }

    exportImage() {
        this.loading.set('generator.actions.export.image.loading');
        setTimeout(async () => {
            this.altImage = this.global.altImage(this.options, this.groups);
            const canvas = await html2canvas(document.getElementById('html2canvas-element')!, {
                logging: false,
                allowTaint: true,
                scale: 2,
            });
            this.dialogImage().open();
            const element = this.image().nativeElement;
            element.innerHTML = '';
            element.appendChild(canvas);
            this._canvas = canvas;
            this.loading.set('');
        });
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

    reset(dialogClearRandomize = false) {
        this.logger.log('reset', LoggerLevel.info);

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
            if (this.options.mode === 'bingo') {
                line.list = line.list.map(_ => null);
            } else {
                line.list = [];
            }
        }

        this.list = this.list.filter(e => e);

        if (dialogClearRandomize) {
            this.logger.log('randomize list', LoggerLevel.info);
            this.list = randomizeArray(this.list);
        }

        this.addIds();
        this.mgMessage.addMessage(this.translate.translate('message.reset.groups'));
    }

    @HostListener('window:keydown.control.s', ['$event'])
    keySaveLocal(event: Event) {
        if (this.hasItems()) {
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
                    this.mgMessage.addMessage(this.translate.translate('message.save.success'));
                }
                this.global.updateList();
            },
            _ => {
                this.mgMessage.addMessage(this.translate.translate('message.save.failed'), {
                    type: MagmaMessageType.error,
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
        this.memory.inChange = true;
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
        setTimeout(() => {
            this.memory.inChange = false;
        });
    }

    @HostListener('window:keydown.control.z', ['$event'])
    undo(event: Event) {
        this.memory.undo(this);
        this.undoRedoUpdate(event);
        event.stopPropagation();
        event.preventDefault();
    }

    @HostListener('window:keydown.control.shift.z', ['$event'])
    redo(event: Event) {
        this.memory.redo(this);
        this.undoRedoUpdate(event);
        event.stopPropagation();
        event.preventDefault();
    }

    private undoRedoUpdate(event: Event) {
        this.detectChanges();
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
        if (this.hasItems()) {
            this.saveJson();
        }
        event.preventDefault();
    }

    saveJson() {
        if (this.hasItems()) {
            downloadFile(JSON.stringify(this.getData()), this.getFileName() + '.json', 'text/plain');
        }
    }

    importJson(event: ImportJsonEvent) {
        this.memory.inChange = true;
        switch (this.new && event.action === 'new' ? 'replace' : event.action) {
            case 'replace': {
                this.groups = event.data?.groups!;
                this.list = event.data?.list!;
                this.addIds();
                this.options = { ...defaultOptions, ...event.data?.options! };
                this.mgMessage.addMessage(this.translate.translate('message.json.read.replace'));
                this.html2canvasImagesCacheUpdate();
                break;
            }
            case 'new': {
                this.global.jsonTmp = event.data;
                this.router.navigate(['edit', 'new']);
                this.mgMessage.addMessage(this.translate.translate('message.json.read.new'));
                break;
            }
        }
        this.dialogImport().close();
        this.effect();
        setTimeout(() => {
            this.memory.inChange = false;
        });
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
                    this.cd.detectChanges();
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
            dateCreate: toISODate(this.classement?.dateCreate, true),
            dateChange: toISODate(this.classement?.dateChange),
        };
    }

    private getFileName(): string {
        return this.options.title.trim() || this.translate.translate('list.title.undefined');
    }

    addIds() {
        // for groups
        this.groups.forEach(group => {
            // add ids to identify lists
            (group.list as any).type ??= `group`;
            (group.list as any).id ??= `group-${randomNumber()}`;

            group.list.forEach(tile => {
                if (tile) {
                    // add ids to identify tiles
                    tile.id ??= `tile-${randomNumber()}`;
                }
            });
        });

        // for list
        // add ids to identify lists
        (this.list as any).type ??= `list`;
        (this.list as any).id ??= 'list';

        this.list.forEach(tile => {
            if (tile) {
                // add ids to identify tiles
                tile.id ??= `tile-${randomNumber()}`;
            }
        });
    }
}
