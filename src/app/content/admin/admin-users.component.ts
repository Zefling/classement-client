import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog.component';
import { MessageService } from 'src/app/components/info-messages.component';
import { User } from 'src/app/interface';
import { APIUserService } from 'src/app/services/api.user.service';


@Component({
    selector: 'admin-users',
    templateUrl: './admin-users.component.html',
    styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent {
    private _sub: Subscription[] = [];

    currentUser?: User;

    users: { [key: number]: User[] } = {};
    total?: number = 0;
    page = 0;

    @ViewChild('dialogClassementsUser') dialogClassementsUser!: DialogComponent;
    @ViewChild('dialogSeeUser') dialogSeeUser!: DialogComponent;

    constructor(
        private userService: APIUserService,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private translate: TranslateService,
    ) {
        this._sub.push(
            this.route.queryParams.subscribe(params => {
                const page = params['page'] || 1;
                this.pageUpdate(page);
            }),
        );
    }

    pageUpdate(page: number) {
        if (!this.users[page]) {
            this.userService.adminGetUsers(page).then(result => {
                this.total = result.total;
                this.page = page;
                this.users[page] = result.list;
            });
        } else {
            this.page = page;
        }
    }

    see(user: User) {
        this.currentUser = user;
        this.dialogClassementsUser.open();
    }

    update(user: User): void {
        this.currentUser = user;
        this.dialogSeeUser.open();
    }
}
