import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import html2canvas from 'html2canvas';
import { Subscription } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog.component';
import { MessageService, MessageType } from 'src/app/components/info-messages.component';
import { Classement } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { GlobalService } from 'src/app/services/global.service';
import { Logger } from 'src/app/services/logger';
import { Utils } from 'src/app/tools/utils';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'classement-view',
    templateUrl: './classement-view.component.html',
    styleUrls: ['./classement-view.component.scss'],
})
export class ClassementViewComponent implements OnDestroy {
    classement?: Classement;
    myClassement?: Classement;
    myClassementCount = 0;

    loading = false;

    currentUser = false;
    logged? = false;

    apiActive = environment.api?.active;

    imagesCache: { [key: string]: string | ArrayBuffer | null } = {};

    @ViewChild('image') image!: ElementRef;
    @ViewChild('dialogImage') dialogImage!: DialogComponent;

    private _canvas?: HTMLCanvasElement;

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
                    const id = params['id'];

                    if (this.apiActive) {
                        this.userService.loggedStatus().then(() => {
                            const classement = this.userService.user?.classements?.find(e => e.rankingId === id);
                            if (classement) {
                                this.logger.log('loadServerClassement (user)');
                                this.loadClassement(classement);
                            } else {
                                this.classementService
                                    .getClassement(id!)
                                    .then(classement => {
                                        this.logger.log('loadServerClassement (server)');
                                        this.loadClassement(classement);
                                    })
                                    .catch(() => {
                                        this.logger.log('loadLocalClassement (browser)');
                                        this.loadLocalClassement(id);
                                    });
                            }
                        });
                    } else {
                        this.loadLocalClassement(id);
                    }
                } else {
                    this.router.navigate(['navigate']);
                }
            }),
        );
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
                    this.myClassementCount = classements?.length || 0;
                    if (this.myClassementCount) {
                        // last on first
                        classements.sort((e, f) => new Date(f.dateCreate).getTime() - new Date(e.dateCreate).getTime());
                        this.myClassement = classements[0];
                    }
                });

            setTimeout(() => {
                this.globalService
                    .imagesCache(this.classement!.data.groups!, this.classement!.data.list!)
                    .then(cache => Object.assign(this.imagesCache, cache));
            });
        }
    }

    copyLink() {
        Utils.copy(`${window.location.protocol}//${window.location.host}/navigate/view/${this.classement!.rankingId}`)
            .then(() => this.messageService.addMessage(this.translate.instant('gererator.ranking.copy.link.success')))
            .catch(e =>
                this.messageService.addMessage(this.translate.instant('gererator.ranking.copy.link.error'), {
                    type: MessageType.error,
                }),
            );
    }

    openClassement() {
        this.router.navigate(['edit', this.classement!.rankingId]);
    }

    seeMyClassement() {
        this.router.navigate(['navigate', 'view', this.myClassement!.rankingId]);
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
