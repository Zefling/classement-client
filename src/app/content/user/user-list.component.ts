import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MessageService } from 'src/app/components/info-messages/info-messages.component';
import { TabContentComponent } from 'src/app/components/tabs/tab-content.component';
import { TabTitleComponent } from 'src/app/components/tabs/tab-title.component';
import { TabsComponent } from 'src/app/components/tabs/tabs.component';
import { SortableDirective } from 'src/app/directives/sortable.directive';
import { Classement, User } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';

import { TagListComponent } from '../../components/tag-list/tag-list.component';
import { SortRuleDirective } from '../../directives/sortable.directive';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { ClassementListComponent } from '../list/classement-list.component';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css'],
    imports: [
        TabsComponent,
        TabContentComponent,
        TabTitleComponent,
        FormsModule,
        SortableDirective,
        SortRuleDirective,
        RouterLink,
        TagListComponent,
        TooltipDirective,
        RouterLinkActive,
        ClassementListComponent,
        DialogComponent,
        DatePipe,
        TranslocoPipe,
    ],
})
export class UserListComponent implements OnInit, OnDestroy {
    private readonly dbService = inject(DBService);
    private readonly classementService = inject(APIClassementService);
    private readonly userService = inject(APIUserService);
    private readonly messageService = inject(MessageService);
    private readonly translate = inject(TranslocoService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly global = inject(GlobalService);

    dialogActionsClassement = viewChild.required<DialogComponent>('dialogActionsClassement');
    sortableDirective = viewChild.required<SortableDirective>(SortableDirective);
    tabs = viewChild.required<TabsComponent>(TabsComponent);

    filter = '';

    currentClassement?: Classement;

    user?: User;

    localIds: string[] = [];

    currentAction?: 'change' | 'delete';

    private listener = Subscriptions.instance();

    constructor() {
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
            this.translate.langChanges$.subscribe(() => {
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

                    this.messageService.addMessage(this.translate.translate(`message.server.${typeName!}.success`));
                    this.currentClassement = undefined;
                });
        } else {
            this.currentClassement = undefined;
        }
        this.dialogActionsClassement().close();
    }
}
