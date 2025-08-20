import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';

import {
    MagmaDialog,
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
    MagmaMessages,
    MagmaSortableDirective,
    MagmaSortableModule,
    MagmaTableModule,
    MagmaTabs,
    MagmaTabsModule,
    MagmaTooltipDirective,
    normalizeString,
} from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { Classement, User } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';

import { TagListComponent } from '../../components/tag-list/tag-list.component';
import { ClassementListComponent } from '../list/classement-list.component';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    imports: [
        FormsModule,
        RouterLink,
        TagListComponent,
        RouterLinkActive,
        ClassementListComponent,
        DatePipe,
        TranslocoPipe,
        MagmaSortableModule,
        MagmaDialog,
        MagmaTooltipDirective,
        MagmaTableModule,
        MagmaInput,
        MagmaInputText,
        MagmaInputElement,
        MagmaTabsModule,
    ],
})
export class UserListComponent implements OnInit, OnDestroy {
    private readonly dbService = inject(DBService);
    private readonly classementService = inject(APIClassementService);
    private readonly userService = inject(APIUserService);
    private readonly mgMessage = inject(MagmaMessages);
    private readonly translate = inject(TranslocoService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly global = inject(GlobalService);

    dialogActionsClassement = viewChild.required<MagmaDialog>('dialogActionsClassement');
    sortableDirective = viewChild.required(MagmaSortableDirective);
    tabs = viewChild.required(MagmaTabs);

    filter = '';

    currentClassement?: Classement;

    user?: User;

    localIds: string[] = [];

    currentAction?: 'change' | 'delete';

    private listener = Subscriptions.instance();

    translateSort = (value: string) => this.translate.translate(value);

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

    updateFilter(filterInput: MagmaInputText, filter: string = '') {
        this.filter = filter;
        setTimeout(() => {
            //  filterInput.dispatchEvent(new InputEvent('input'));
            filterInput.focus(true);
        });
    }

    sortableFilter = (key: string, item: Classement, _index: number): boolean => {
        return (
            (!key.startsWith('#') && normalizeString(item.name).includes(normalizeString(key))) ||
            (key.startsWith('#') &&
                item?.data?.options?.tags?.map(e => `#${normalizeString(e)}`).includes(`${normalizeString(key)}`))
        );
    };

    tagClick(event: string, filterInput: MagmaInputText) {
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

                    this.mgMessage.addMessage(this.translate.translate(`message.server.${typeName!}.success`));
                    this.currentClassement = undefined;
                });
        } else {
            this.currentClassement = undefined;
        }
        this.dialogActionsClassement().close();
    }
}
