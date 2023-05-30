import { Component, DoCheck, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MessageService, MessageType } from 'src/app/components/info-messages/info-messages.component';
import { SortDirection, SortUserCol, User } from 'src/app/interface';
import { Role } from 'src/app/services/api.moderation';
import { APIUserService } from 'src/app/services/api.user.service';
import { Logger, LoggerLevel } from 'src/app/services/logger';
import { Subscriptions } from 'src/app/tools/subscriptions';

@Component({
    selector: 'admin-users',
    templateUrl: './admin-users.component.html',
    styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements DoCheck, OnDestroy {
    private _sub = Subscriptions.instance();

    searchKey?: string;

    loading = false;

    users: { [key: number]: User[] } = {};
    total?: number = 0;
    page = 0;

    sort: SortUserCol = 'dateCreate';
    direction: SortDirection = 'DESC';

    @ViewChild('dialogListClassements') dialogListClassements!: DialogComponent;

    @ViewChild('dialogActionsUser') dialogActionsUser!: DialogComponent;
    currentUser?: User;
    userForm?: FormGroup;
    isAdmin = false;
    showError?: string;

    @ViewChild('dialogRemoveProfile') dialogRemoveProfile!: DialogComponent;

    constructor(
        private readonly userService: APIUserService,
        private readonly route: ActivatedRoute,
        private readonly messageService: MessageService,
        private readonly translate: TranslateService,
        private readonly logger: Logger,
    ) {
        this._sub.push(
            this.route.queryParams.subscribe(params => {
                this.sort ||= params['sort'] || 'dateCreate';
                this.direction ||= params['direction'] || 'DESC';
                const page = params['page'] || 1;
                this.pageUpdate(page);
            }),
        );
        this.isAdmin = this.userService.isAdmin;
    }

    ngDoCheck(): void {
        if (this.userForm?.get('banned') && this.currentUser) {
            const banner = this.userForm.get('banned')!;
            if ((this.disabledBanned() && banner.enabled) || this.currentUser.id === this.userService.user!.id) {
                banner.disable();
            } else if (!this.disabledBanned() && banner.disabled) {
                banner.enable();
            }
        }
    }

    ngOnDestroy(): void {
        this._sub.clear();
    }

    sortUpdate(sort: SortUserCol) {
        this.users = {};
        if (this.sort === sort) {
            this.direction = this.direction === 'DESC' ? 'ASC' : 'DESC';
        } else {
            this.sort = sort;
            this.direction = 'DESC';
        }
        this.pageUpdate(1);
    }

    pageUpdate(page: number) {
        if (!this.users[page]) {
            this.loading = true;
            this.userService
                .adminGetUsers(page, this.sort, this.direction, this.searchKey)
                .then(result => {
                    this.total = result.total;
                    this.page = page;
                    this.users[page] = result.list;
                })
                .finally(() => {
                    this.loading = false;
                });
        } else {
            this.page = page;
        }
    }

    submit() {
        this.users = {};
        this.sort = 'dateCreate';
        this.direction = 'DESC';
        this.pageUpdate(1);
    }

    see(user: User) {
        this.currentUser = user;
        this.dialogListClassements.open();
    }

    update(user: User): void {
        this.currentUser = user;
        this.userForm = new FormGroup({
            username: new FormControl(''),
            password: new FormControl(''),
            email: new FormControl(''),
            moderator: new FormControl(this.currentUser.roles.includes(Role.MODERATOR)),
            admin: new FormControl(this.currentUser.roles.includes(Role.ADMIN)),
            banned: new FormControl(this.currentUser.roles.includes(Role.BANNED)),
        });
        this.dialogActionsUser.open();
    }

    disabledBanned() {
        return (
            (this.isAdmin && this.userForm?.get('admin')?.value) ||
            (!this.isAdmin && this.currentUser?.roles.includes('ROLE_ADMIN'))
        );
    }

    changeStatus() {
        this.userService
            .adminUpdateUser(this.currentUser!.id, this.userForm?.value)
            .then(user => {
                Object.assign(this.currentUser!, user);
                this.messageService.addMessage(this.translate.instant('message.user.update.success'));
                this.changeStatusCancel();
            })
            .catch(e => {
                this.logger.log(e, LoggerLevel.warn);
                this.showError = e;
            });
    }

    changeStatusCancel() {
        this.userForm = undefined;
        this.currentUser = undefined;
        this.dialogActionsUser.close();
    }

    removeProfile(user: User) {
        this.currentUser = user;
        this.dialogRemoveProfile.open();
    }

    valideRemoveProfile() {
        this.userService
            .adminRemoveUser(this.currentUser!.id)
            .then(_ => {
                this.currentUser!.username = '';
                this.currentUser!.roles = [];
                this.cancelRemoveProfile();
                this.messageService.addMessage(this.translate.instant('message.user.remove.success'));
            })
            .catch(e => {
                this.messageService.addMessage(e, { type: MessageType.error });
            });
    }

    cancelRemoveProfile() {
        this.currentUser = undefined;
        this.dialogRemoveProfile.close();
    }
}
