import { Component, ElementRef, OnDestroy, viewChild } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslocoService } from '@jsverse/transloco';

import html2canvas from '@html2canvas/html2canvas';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MessageService, MessageType } from 'src/app/components/info-messages/info-messages.component';
import { Classement, ClassementHistory, ScreenMode } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { GlobalService } from 'src/app/services/global.service';
import { Logger, LoggerLevel } from 'src/app/services/logger';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';
import { environment } from 'src/environments/environment';

import { MessageError } from '../user/user.interface';

@Component({
    selector: 'classement-view',
    templateUrl: './classement-view.component.html',
    styleUrls: ['./classement-view.component.scss'],
})
export class ClassementViewComponent implements OnDestroy {
    classement?: Classement;
    myClassement?: Classement;
    myClassements?: Classement[];
    myClassementCount = 0;

    loading = false;

    currentUser = false;
    logged? = false;
    exportImageDisabled = true;

    apiActive = environment.api?.active;

    imagesCache: Record<string, string | ArrayBuffer | null> = {};

    showError: string = '';

    history?: ClassementHistory[];
    historyId?: number;

    classScreenMode: ScreenMode = 'default';

    image = viewChild.required<ElementRef>('image');
    dialogImage = viewChild.required<DialogComponent>('dialogImage');
    dialogDerivatives = viewChild.required<DialogComponent>('dialogDerivatives');
    dialogHistory = viewChild.required<DialogComponent>('dialogHistory');
    dialogPassword = viewChild.required<DialogComponent>('dialogPassword');

    private canvas?: HTMLCanvasElement;
    private id?: string;
    private sub = Subscriptions.instance();

    constructor(
        private readonly classementService: APIClassementService,
        private readonly userService: APIUserService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly logger: Logger,
        private readonly bdService: DBService,
        private readonly messageService: MessageService,
        private readonly translate: TranslocoService,
        private readonly global: GlobalService,
        private readonly meta: Meta,
    ) {
        this.logged = this.userService.logged;

        this.sub.push(
            this.route.params.subscribe(params => {
                if (params['id'] && params['id'] !== 'new') {
                    this.id = params['id'];
                    this.historyId = params['history'] ? +params['history'] : undefined;

                    if (this.apiActive) {
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
        this.global.setTitle(classement.data.options.title);
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

    ngOnDestroy(): void {
        this.sub.clear();
        ['twitter:card', 'og:url', 'og:title', 'og:description', 'og:image', 'title', 'description', 'image'].forEach(
            item => {
                this.meta.removeTag(`name="${item}"`);
            },
        );
    }

    loadClassement(classement: Classement) {
        this.classement = classement;

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
                    history.sort((a, b) => new Date(b.date as any).getTime() - new Date(a.date as any).getTime());
                    this.history = [
                        {
                            date: this.classement?.dateChange ?? this.classement?.dateCreate,
                            name: this.classement?.name,
                        },
                        ...history,
                    ];
                }
                classement.withHistory = history?.length;
            });
        }
    }

    getLink() {
        return `${location.protocol}//${location.host}/~${this.getClassementId(this.classement!)}${
            this.historyId ? `/${this.historyId}` : ''
        }`;
    }

    copyLink() {
        Utils.clipboard(this.getLink())
            .then(() => this.messageService.addMessage(this.translate.translate('generator.ranking.copy.link.success')))
            .catch(_e =>
                this.messageService.addMessage(this.translate.translate('generator.ranking.copy.link.error'), {
                    type: MessageType.error,
                }),
            );
    }

    openClassement() {
        this.router.navigate(['edit', this.getClassementId(this.classement!)]);
    }

    openClassementFork() {
        this.router.navigate(['edit', this.getClassementId(this.classement!), 'fork']);
    }

    seeMyClassement() {
        this.router.navigate(['navigate', 'view', this.getClassementId(this.myClassement!)]);
    }

    seeHistory() {
        this.dialogHistory().open();
    }

    loadHistoryClassement(history: ClassementHistory) {
        this.router.navigate(
            history.id
                ? ['navigate', 'view', this.getClassementId(this.classement!), history.id]
                : ['navigate', 'view', this.getClassementId(this.classement!)],
        );
        this.dialogHistory().close();
    }

    seeMyClassements() {
        this.dialogDerivatives().open();
    }

    loadDerivativeClassement(classement: Classement) {
        this.router.navigate(['navigate', 'view', this.getClassementId(classement)]);
        this.dialogDerivatives().close();
    }

    openMyClassement() {
        this.router.navigate(['edit', this.classement!.linkId || this.myClassement!.rankingId]);
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

    saveImage(type: 'PNG' | 'JPG' | 'WEBP') {
        const title = this.getFileName();
        if (this.canvas) {
            switch (type) {
                case 'PNG':
                    this.downloadImage(this.canvas.toDataURL('image/png'), `${title}.png`);
                    break;
                case 'JPG':
                    this.downloadImage(this.canvas.toDataURL('image/jpeg', 1.0), `${title}.jpeg`);
                    break;
                case 'WEBP':
                    this.downloadImage(this.canvas.toDataURL('image/webp', 1.0), `${title}.webp`);
                    break;
            }
        }
    }

    private getFileName(): string {
        return this.classement!.data.options.title.trim() || this.translate.translate('list.title.undefined');
    }

    private downloadImage(data: string, filename: string) {
        Utils.downloadFile(data, filename);
    }

    private getClassementId(classement: Classement) {
        return classement!.linkId || classement!.rankingId;
    }
}
