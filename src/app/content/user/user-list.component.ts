import { Component, OnDestroy, OnInit, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MessageService } from 'src/app/components/info-messages/info-messages.component';
import { TabsComponent } from 'src/app/components/tabs/tabs.component';
import { SortableDirective } from 'src/app/directives/sortable.directive';
import { Classement, User } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
    dialogActionsClassement = viewChild.required<DialogComponent>('dialogActionsClassement');
    sortableDirective = viewChild.required<SortableDirective>(SortableDirective);
    tabs = viewChild.required<TabsComponent>(TabsComponent);

    filter = '';

    currentClassement?: Classement;

    user?: User;

    localIds: string[] = [];

    currentAction?: 'change' | 'delete';

    private listener = Subscriptions.instance();

    constructor(
        private readonly dbService: DBService,
        private readonly classementService: APIClassementService,
        private readonly userService: APIUserService,
        private readonly messageService: MessageService,
        private readonly translate: TranslateService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly global: GlobalService,
    ) {
        this.user = this.userService.user;

        this.listener.push(
            this.route.params.subscribe(params => {
                if (params['page']) {
                    setTimeout(() => {
                        this.tabs().update(params['page'], false);
                    });
                }
            }),
            this.userService.afterLogout.subscribe(() => {
                this.router.navigate(['/list']);
            }),
            this.translate.onLangChange.subscribe(() => {
                this.updateTitle();
            }),
        );

        if (!this.userService.logged) {
            this.router.navigate(['/list']);
        }

        // list of browser ranking
        this.dbService.getLocalList().then(result => {
            result.forEach(e => {
                if (e.id) {
                    this.localIds.push(e.id);
                }
            });
        });
    }

    ngOnInit(): void {
        this.updateTitle();
    }

    updateTitle() {
        this.global.setTitle('menu.my.lists');
    }

    updateFilter(filterInput: HTMLInputElement, filter: string = '') {
        this.filter = filter;
        setTimeout(() => {
            filterInput.dispatchEvent(new InputEvent('input'));
            filterInput.focus();
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

    tagClick(event: string, filterInput: HTMLInputElement) {
        this.updateFilter(filterInput, `#${event}`);
    }

    ngOnDestroy(): void {
        this.listener.clear();
    }

    tabChange(id: string): void {
        this.router.navigate(['/user/lists/' + id]);
    }

    action(classement: Classement, action: 'change' | 'delete'): void {
        this.currentAction = action;
        this.currentClassement = classement;
        this.dialogActionsClassement().open();
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
        this.dialogActionsClassement().close();
    }
}
