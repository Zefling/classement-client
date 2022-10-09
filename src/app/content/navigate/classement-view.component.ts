import { Component } from '@angular/core';
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
export class ClassementViewComponent {
    classement?: Classement;

    loading = false;

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
        this._sub.push(
            this.route.params.subscribe(params => {
                if (params['id'] && params['id'] !== 'new') {
                    const id = params['id'];

                    if (this.apiActive) {
                        this.userService.loggedStatus().then(() => {
                            const classement = this.userService.user?.classements?.find(e => e.rankingId === id);
                            if (classement) {
                                this.logger.log('loadServerClassement (user)');
                                this.classement = classement;
                            } else {
                                this.classementService
                                    .getClassement(id!)
                                    .then(classement => {
                                        this.logger.log('loadServerClassement (server)');
                                        this.classement = classement;
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

    ngOnDistroy() {
        this._sub.forEach(e => e.unsubscribe());
    }

    openClassement() {
        this.router.navigate(['edit', this.classement!.rankingId]);
    }

    loadLocalClassement(id: string) {
        this.bdService
            .loadLocal(id!)
            .then(data => {
                this.logger.log('local found');

                const rankingId = data.infos.rankingId;
                const templateId = data.infos.templateId;
                const parentId = data.infos.parentId;

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
