import { Component, Host, OnDestroy, ViewChild } from '@angular/core';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { APIUserService } from 'src/app/services/api.user.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

import { ClassementEditComponent } from './classement-edit.component';

import { UserLoginComponent } from '../user/user-login.component';

@Component({
    selector: 'classement-login',
    templateUrl: './classement-login.component.html',
    styleUrls: ['./classement-login.component.scss'],
})
export class ClassementLoginComponent implements OnDestroy {
    @ViewChild('dialogLogin') dialogLogin!: DialogComponent;

    loginComponent = UserLoginComponent;

    private _sub = Subscriptions.instance();

    constructor(@Host() private readonly edit: ClassementEditComponent, private readonly userService: APIUserService) {
        this._sub.push(
            this.userService.afterLogin.subscribe(() => {
                this.dialogLogin.close();
                this.edit.logged = true;
                this.edit.dialogSaveServer.open();
            }),
        );
    }

    ngOnDestroy() {
        this._sub.clear();
    }

    open() {
        this.dialogLogin.open();
    }
}
