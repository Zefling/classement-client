import { DatePipe, NgClass } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    computed,
    inject,
    viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import html2canvas from '@html2canvas/html2canvas';
import {
    MagmaDialog,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputPassword,
    MagmaLoaderBlock,
    MagmaLoaderTile,
    MagmaMessage,
    MagmaMessageType,
    MagmaSpinner,
} from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { ClassementInfosComponent } from 'src/app/components/classement-infos/classement-infos.component';
import {
    Classement,
    ClassementHistory,
    FileString,
    MessageError,
    Options,
    ScreenMode,
} from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { FileFormatExport, GlobalService } from 'src/app/services/global.service';
import { Logger, LoggerLevel } from 'src/app/services/logger';
import { PreferencesService } from 'src/app/services/preferences.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';

import { SeeClassementComponent } from '../../components/see-classement/see-classement.component';
import { TileComponent } from '../../components/tile/tile.component';

const metaTags = ['twitter:card', 'og:url', 'og:title', 'og:description', 'og:image', 'title', 'description', 'image'];

@Component({
    selector: 'classement-view',
    templateUrl: './classement-view.component.html',
    styleUrls: ['./classement-view.component.scss'],
    imports: [
        RouterLink,
        FormsModule,
        SeeClassementComponent,
        ClassementInfosComponent,
        NgClass,
        MagmaDialog,
        DatePipe,
        TranslocoPipe,
        MagmaSpinner,
        MagmaInput,
        MagmaInputCheckbox,
        MagmaInputPassword,
        MagmaLoaderBlock,
        MagmaLoaderTile,
        TileComponent,
    ],
})
export class ClassementViewComponent implements OnInit, OnDestroy {
    private readonly classementService = inject(APIClassementService);
    private readonly userService = inject(APIUserService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly logger = inject(Logger);
    private readonly bdService = inject(DBService);
    private readonly mgMessage = inject(MagmaMessage);
    private readonly translate = inject(TranslocoService);
    private readonly global = inject(GlobalService);
    private readonly prefs = inject(PreferencesService);
    private readonly meta = inject(Meta);
    protected readonly cd = inject(ChangeDetectorRef);

    classement?: Classement;
    myClassement?: Classement;
    myClassements?: Classement[];
    myClassementCount = 0;

    emptyGroups = false;

    loading = false;

    currentUser = false;
    logged? = false;
    exportImageDisabled = true;

    modeApi = computed(() => this.global.withApi());

    imagesCache: Record<string, string | ArrayBuffer | null> = {};

    showError: string = '';

    history?: ClassementHistory[];
    historyId?: number;

    classScreenMode: ScreenMode = 'default';

    optionFork = ['image', 'txt-color', 'bg-color', 'annotations', 'reset-groups'];

    showLink = true;

    image = viewChild.required<ElementRef>('image');
    dialogImage = viewChild.required<MagmaDialog>('dialogImage');
    dialogDerivatives = viewChild.required<MagmaDialog>('dialogDerivatives');
    dialogHistory = viewChild.required<MagmaDialog>('dialogHistory');
    dialogPassword = viewChild.required<MagmaDialog>('dialogPassword');
    dialogCopy = viewChild.required<MagmaDialog>('dialogCopy');

    private canvas?: HTMLCanvasElement;
    private id?: string;
    private sub = Subscriptions.instance();

    constructor() {
        this.logged = this.userService.logged;

        this.sub.push(
            this.route.params.subscribe(params => {
                if (params['id'] && params['id'] !== 'new') {
                    this.id = params['id'];
                    this.historyId = params['history'] ? +params['history'] : undefined;

                    if (this.modeApi()) {
                        this.userService.loggedStatus().then(() => {
                            let classement = this.userService.user?.classements?.find(
                                e => e.rankingId === this.id || this.id === e.linkId,
                            );
                            this.exportImageDisabled = true;
                            if (!classement && !this.historyId) {
                                classement = this.userService.getByIdFormCache(this.id!);
                            }
                            if (classement && !this.historyId) {
                                this.logger.log('loadServerClassement (user)');
                                this.loadClassement(classement);
                            } else {
                                this.classementService
                                    .getClassement(this.id!, undefined, this.historyId)
                                    .then(classement => {
                                        this.logger.log('loadServerClassement (server)');
                                        this.loadClassement(classement);
                                    })
                                    .catch(e => {
                                        this.logger.log('loadLocalClassement (browser)', LoggerLevel.info, e);
                                        if ((e as MessageError)?.code === 401) {
                                            this.dialogPassword().open();
                                        } else {
                                            this.loadLocalClassement(this.id!);
                                        }
                                    });
                            }
                        });
                    } else {
                        this.loadLocalClassement(this.id!);
                    }
                } else {
                    this.router.navigate(['navigate']);
                }
            }),
            this.translate.langChanges$.subscribe(() => {
                if (this.classement) {
                    this.updateTitle(this.classement);
                }
            }),
        );
    }

    ngOnInit(): void {
        this.global.zoomActive.set(true);
    }

    ngOnDestroy(): void {
        this.sub.clear();
        metaTags.forEach(item => this.meta.removeTag(`name="${item}"`));
        this.global.zoomActive.set(false);
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

    updateTitle(classement: Classement) {
        this.global.setTitle(classement.data.options.title, false, false);
    }

    openClassementWithPassword(password: string) {
        this.classementService
            .getClassement(this.id!, password, this.historyId)
            .then(classement => {
                this.logger.log('loadServerClassement (server)');
                this.userService.addCache(classement);
                this.loadClassement(classement);
                this.dialogPassword().close();
            })
            .catch(e => {
                this.logger.log('loadLocalClassement (browser)', LoggerLevel.info, e);
                // password required
                if ((e as MessageError)?.code === 401) {
                    this.showError = this.translate.translate(`error.api-code.${(e as MessageError).errorCode}`);
                }
            });
    }

    cancelPassword() {
        this.dialogPassword().close();
        this.router.navigate(['navigate']);
    }

    loadClassement(classement: Classement) {
        this.classement = classement;

        this.emptyGroups = classement.data.groups.reduce<number>((val, group) => val + group.list.length, 0) === 0;

        Utils.formattedTilesByMode(classement.data.options, classement.data.groups, classement.data.list);

        this.updateTitle(classement);

        this.meta.addTags([
            { name: 'twitter:card', content: 'summary' },
            { name: 'og:url', content: this.getLink() },
            { name: 'og:title', content: this.classement.data.options.title },
            { name: 'og:description', content: this.classement.data.options.description },
            { name: 'og:image', content: this.classement.banner },
            { name: 'title', content: this.classement.data.options.title },
            { name: 'description', content: this.classement.data.options.description },
            { name: 'image', content: this.classement.banner },
        ]);

        if (this.userService.logged) {
            this.currentUser = this.userService.user?.username === classement.user;
            this.classementService
                .getClassementsByTemplateId(classement?.templateId, this.userService.user?.id)
                .then(classements => {
                    this.myClassements = classements;
                    this.myClassementCount = classements?.length || 0;
                    if (this.myClassementCount) {
                        // last on first
                        classements.sort((e, f) => new Date(f.dateCreate).getTime() - new Date(e.dateCreate).getTime());
                        this.myClassement = classements[0];
                    }
                });
        }

        setTimeout(() => {
            this.global
                .imagesCache(this.classement!.data.options, this.classement!.data.groups!)
                .then(cache => Object.assign(this.imagesCache, cache))
                .finally(() => (this.exportImageDisabled = false));
        });

        // load history
        if (classement.withHistory) {
            this.classementService.getClassementsHistory(classement.rankingId).then(history => {
                if (history?.length) {
                    this.history = history.sort(
                        (a, b) =>
                            new Date((b.date as any) ?? b.dateChange ?? b.dateCreate).getTime() -
                            new Date((a.date as any) ?? a.dateChange ?? a.dateCreate).getTime(),
                    );
                }
                classement.withHistory = history?.length;
            });
        }
    }

    getLink() {
        return `${location.protocol}//${location.host}/~${Utils.getClassementId(this.classement!)}${
            this.historyId ? `/${this.historyId}` : ''
        }`;
    }

    copyLink() {
        Utils.clipboard(this.getLink())
            .then(() => this.mgMessage.addMessage(this.translate.translate('generator.ranking.copy.link.success')))
            .catch(_e =>
                this.mgMessage.addMessage(this.translate.translate('generator.ranking.copy.link.error'), {
                    type: MagmaMessageType.error,
                }),
            );
    }

    openClassement() {
        this.router.navigate(['edit', Utils.getClassementId(this.classement!)]);
    }

    async openClassementFork() {
        if ((await this.prefs.init()).advancedFork) {
            this.dialogCopy().open();
        } else {
            this.router.navigate(['edit', Utils.getClassementId(this.classement!), 'fork']);
        }
    }

    cancelCopy() {
        this.dialogCopy().close();
    }

    openClassementForkWithOptions() {
        this.router.navigate(['edit', Utils.getClassementId(this.classement!), 'fork', this.optionFork?.join(',')]);
    }

    seeMyClassement() {
        this.router.navigate(['navigate', 'view', Utils.getClassementId(this.myClassement!)]);
    }

    seeHistory() {
        this.dialogHistory().open();
    }

    loadHistoryClassement(history: ClassementHistory) {
        this.router.navigate(
            history.id
                ? ['navigate', 'view', Utils.getClassementId(this.classement!), history.id]
                : ['navigate', 'view', Utils.getClassementId(this.classement!)],
        );
        this.dialogHistory().close();
    }

    seeMyClassements() {
        this.dialogDerivatives().open();
    }

    loadDerivativeClassement(classement: Classement) {
        this.router.navigate(['navigate', 'view', Utils.getClassementId(classement)]);
        this.dialogDerivatives().close();
    }

    openMyClassement() {
        this.router.navigate(['edit', Utils.getClassementId(this.myClassement!)]);
    }

    loadLocalClassement(id: string) {
        this.bdService
            .loadLocal(id!)
            .then(data => {
                this.logger.log('local found');

                const rankingId = data.infos.rankingId;
                const templateId = data.infos.templateId;
                const parentId = data.infos.parentId;
                const linkId = data.infos.linkId;
                const banner = data.infos.parentId;

                this.currentUser = true;

                this.classement = {
                    localId: id,
                    rankingId,
                    templateId,
                    parentId,
                    linkId,
                    banner,
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
            })
            .catch(() => {
                this.logger.log('local not found');
                this.router.navigate(['navigate']);
            });
    }

    exportImage() {
        this.dialogImage().open();
        html2canvas(document.getElementById('html2canvas-element')!, {
            logging: false,
            allowTaint: true,
            scale: 2,
        }).then(canvas => {
            const element = this.image().nativeElement;
            element.innerHTML = '';
            element.appendChild(canvas);
            this.canvas = canvas;
        });
    }

    saveImage(type: FileFormatExport) {
        this.global.saveImage(this.canvas, this.getFileName(), type);
    }

    calcWidth(options: Options, item: FileString, element: HTMLElement | null) {
        // hack for calcule de width of the image
        Utils.calcWidth(options, item, element);
        return true;
    }

    private getFileName(): string {
        return this.classement!.data.options.title.trim() || this.translate.translate('list.title.undefined');
    }
}
