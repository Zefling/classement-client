import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import html2canvas from 'html2canvas';
import { Subscription } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MessageService, MessageType } from 'src/app/components/info-messages/info-messages.component';
import { Classement, ClassementHistory } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { GlobalService } from 'src/app/services/global.service';
import { Logger, LoggerLevel } from 'src/app/services/logger';
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

    imagesCache: { [key: string]: string | ArrayBuffer | null } = {};

    showError: string = '';

    history?: ClassementHistory[];
    historyId?: number;

    @ViewChild('image') image!: ElementRef;
    @ViewChild('dialogImage') dialogImage!: DialogComponent;
    @ViewChild('dialogDerivatives') dialogDerivatives!: DialogComponent;
    @ViewChild('dialogHistory') dialogHistory!: DialogComponent;
    @ViewChild('dialogPassword') dialogPassword!: DialogComponent;

    private _canvas?: HTMLCanvasElement;
    private _id?: string;
    private _sub: Subscription[] = [];

    constructor(
        private classementService: APIClassementService,
        private userService: APIUserService,
        private router: Router,
        private route: ActivatedRoute,
        private logger: Logger,
        private bdService: DBService,
        private messageService: MessageService,
        private translate: TranslateService,
        private globalService: GlobalService,
    ) {
        this.logged = this.userService.logged;

        this._sub.push(
            this.route.params.subscribe(params => {
                if (params['id'] && params['id'] !== 'new') {
                    this._id = params['id'];
                    this.historyId = params['history'] ? +params['history'] : undefined;

                    if (this.apiActive) {
                        this.userService.loggedStatus().then(() => {
                            let classement = this.userService.user?.classements?.find(e => e.rankingId === this._id);
                            this.exportImageDisabled = true;
                            if (!classement && !this.historyId) {
                                classement = this.userService.getByIdFormCache(this._id!);
                            }
                            if (classement && !this.historyId) {
                                this.logger.log('loadServerClassement (user)');
                                this.loadClassement(classement);
                            } else {
                                this.classementService
                                    .getClassement(this._id!, undefined, this.historyId)
                                    .then(classement => {
                                        this.logger.log('loadServerClassement (server)');
                                        this.loadClassement(classement);
                                    })
                                    .catch(e => {
                                        this.logger.log('loadLocalClassement (browser)', LoggerLevel.info, e);
                                        if ((e as MessageError)?.code === 401) {
                                            this.dialogPassword.open();
                                        } else {
                                            this.loadLocalClassement(this._id!);
                                        }
                                    });
                            }
                        });
                    } else {
                        this.loadLocalClassement(this._id!);
                    }
                } else {
                    this.router.navigate(['navigate']);
                }
            }),
        );
    }

    openClassementWithPassword(password: string) {
        this.classementService
            .getClassement(this._id!, password, this.historyId)
            .then(classement => {
                this.logger.log('loadServerClassement (server)');
                this.userService.addCache(classement);
                this.loadClassement(classement);
                this.dialogPassword.close();
            })
            .catch(e => {
                this.logger.log('loadLocalClassement (browser)', LoggerLevel.info, e);
                // password required
                if ((e as MessageError)?.code === 401) {
                    this.showError = this.translate.instant(`error.api-code.${(e as MessageError).errorCode}`);
                }
            });
    }

    cancelPassword() {
        this.dialogPassword.close();
        this.router.navigate(['navigate']);
    }

    ngOnDestroy(): void {
        this._sub.forEach(e => e.unsubscribe());
    }

    loadClassement(classement: Classement) {
        this.classement = classement;

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
            this.globalService
                .imagesCache(this.classement!.data.options, this.classement!.data.groups!)
                .then(cache => Object.assign(this.imagesCache, cache))
                .finally(() => (this.exportImageDisabled = false));
        });

        // load history
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
        });
    }

    copyLink() {
        Utils.copy(`${window.location.protocol}//${window.location.host}/navigate/view/${this.classement!.rankingId}`)
            .then(() => this.messageService.addMessage(this.translate.instant('gererator.ranking.copy.link.success')))
            .catch(_e =>
                this.messageService.addMessage(this.translate.instant('gererator.ranking.copy.link.error'), {
                    type: MessageType.error,
                }),
            );
    }

    openClassement() {
        this.router.navigate(['edit', this.classement!.rankingId]);
    }

    openClassementFork() {
        this.router.navigate(['edit', this.classement!.rankingId, 'fork']);
    }

    seeMyClassement() {
        this.router.navigate(['navigate', 'view', this.myClassement!.rankingId]);
    }

    seeHistory() {
        this.dialogHistory.open();
    }

    loadHistoryClassement(history: ClassementHistory) {
        this.router.navigate(
            history.id
                ? ['navigate', 'view', this.classement!.rankingId, history.id]
                : ['navigate', 'view', this.classement!.rankingId],
        );
        this.dialogHistory.close();
    }

    seeMyClassements() {
        this.dialogDerivatives.open();
    }

    loadDerivativeClassement(classement: Classement) {
        this.router.navigate(['navigate', 'view', classement.rankingId]);
        this.dialogDerivatives.close();
    }

    openMyClassement() {
        this.router.navigate(['edit', this.myClassement!.rankingId]);
    }

    loadLocalClassement(id: string) {
        this.bdService
            .loadLocal(id!)
            .then(data => {
                this.logger.log('local found');

                const rankingId = data.infos.rankingId;
                const templateId = data.infos.templateId;
                const parentId = data.infos.parentId;

                this.currentUser = true;

                this.classement = {
                    localId: id,
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
            })
            .catch(() => {
                this.logger.log('local not found');
                this.router.navigate(['navigate']);
            });
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

    private getFileName(): Data {
        return this.classement!.data.options.title.trim() || this.translate.instant('list.title.undefined');
    }

    private downloadImage(data: string, filename: string) {
        const a = document.createElement('a');
        a.href = data;
        a.download = filename;
        a.click();
    }
}
