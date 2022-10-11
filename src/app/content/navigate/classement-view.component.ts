import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Classement } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { Logger } from 'src/app/services/logger';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'classement-view',
    templateUrl: './classement-view.component.html',
    styleUrls: ['./classement-view.component.scss'],
})
export class ClassementViewComponent implements OnDestroy {
    classement?: Classement;
    myClassement?: Classement;

    loading = false;

    currentUser = false;
    logged? = false;

    apiActive = environment.api?.active;

    private _sub: Subscription[] = [];

    constructor(
        private classementService: APIClassementService,
        private userService: APIUserService,
        private router: Router,
        private route: ActivatedRoute,
        private logger: Logger,
        private bdService: DBService,
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
        this.currentUser = this.userService.user?.username === classement.user;

        this.classementService.getClassementsByTemplateId(classement?.templateId).then(classements => {
            if (classements?.length) {
                this.myClassement = classements.find(
                    e => this.userService.user?.username === e.user && this.classement?.rankingId !== e.rankingId,
                );
            }
        });
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
}
