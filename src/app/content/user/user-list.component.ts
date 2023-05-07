import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MessageService } from 'src/app/components/info-messages/info-messages.component';
import { TabsComponent } from 'src/app/components/tabs/tabs.component';
import { SortableDirective } from 'src/app/directives/sortable.directive';
import { Classement, User } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { Utils } from 'src/app/tools/utils';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnDestroy {
    @ViewChild('dialogActionsClassement') dialogActionsClassement!: DialogComponent;
    @ViewChild(SortableDirective) sortableDirective!: SortableDirective;
    @ViewChild('filter') filter!: ElementRef<HTMLInputElement>;

    @ViewChild(TabsComponent) tabs!: TabsComponent;

    currentClassement?: Classement;

    user?: User;

    localIds: string[] = [];

    currentAction?: 'change' | 'delete';

    private listener: Subscription[] = [];

    constructor(
        private dbservice: DBService,
        private classementService: APIClassementService,
        private userService: APIUserService,
        private messageService: MessageService,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.user = this.userService.user;

        this.listener.push(
            this.route.params.subscribe(params => {
                if (params['page']) {
                    setTimeout(() => {
                        this.tabs?.update(params['page'], false);
                    });
                }
            }),
        );

        if (!this.userService.logged) {
            this.router.navigate(['/list']);
        }

        // list of browser ranking
        this.dbservice.getLocalList().then(result => {
            result.forEach(e => {
                if (e.id) {
                    this.localIds.push(e.id);
                }
            });
        });
    }

    sortableFilter = (key: string, item: Classement, _index: number): boolean => {
        return (
            (!key.startsWith('#') && Utils.normalizeString(item.name).includes(Utils.normalizeString(key))) ||
            (key.startsWith('#') &&
                item?.data?.options?.tags
                    ?.map(e => `#${Utils.normalizeString(e)}`)
                    .includes(`${Utils.normalizeString(key)}`))
        );
    };

    tagClick(event: string) {
        this.filter.nativeElement.value = `#${event}`;
        this.sortableDirective.update();
    }

    ngOnDestroy(): void {
        this.listener.forEach(e => e.unsubscribe());
    }

    tabChange(id: string): void {
        this.router.navigate(['/user/lists/' + id]);
    }

    action(classement: Classement, action: 'change' | 'delete'): void {
        this.currentAction = action;
        this.currentClassement = classement;
        this.dialogActionsClassement.open();
    }

    actionForCurrentClassement(type: 'delete' | 'hide' | 'close', status: boolean = true): void {
        if (type === 'delete' || type === 'hide') {
            this.classementService
                .statusClassement(this.currentClassement!.rankingId, status, type)
                .then(classements => {
                    let typeName: string;

                    if (type === 'delete') {
                        typeName = 'deleted';
                        Utils.removeClassement(this.user!.classements, this.currentClassement!);
                    } else if (type === 'hide') {
                        typeName = status ? 'hidden' : 'showed';
                        Utils.updateClassements(this.user!.classements, classements, this.user);
                    }

                    this.messageService.addMessage(this.translate.instant(`message.server.${typeName!}.success`));
                    this.currentClassement = undefined;
                });
        } else {
            this.currentClassement = undefined;
        }
        this.dialogActionsClassement.close();
    }
}
