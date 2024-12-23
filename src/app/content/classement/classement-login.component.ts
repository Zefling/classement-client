import { NgComponentOutlet } from '@angular/common';
import { Component, OnDestroy, inject, viewChild } from '@angular/core';
import { ɵEmptyOutletComponent } from '@angular/router';

import { TranslocoPipe } from '@jsverse/transloco';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { APIUserService } from 'src/app/services/api.user.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

import { ClassementEditComponent } from './classement-edit.component';

import { UserLoginComponent } from '../user/user-login.component';

@Component({
    selector: 'classement-login',
    templateUrl: './classement-login.component.html',
    styleUrls: ['./classement-login.component.scss'],
    imports: [DialogComponent, NgComponentOutlet, ɵEmptyOutletComponent, TranslocoPipe],
})
export class ClassementLoginComponent implements OnDestroy {
    private readonly edit = inject(ClassementEditComponent, { host: true });
    private readonly userService = inject(APIUserService);

    dialogLogin = viewChild.required<DialogComponent>('dialogLogin');

    loginComponent = UserLoginComponent;

    private _sub = Subscriptions.instance();

    constructor() {
        this._sub.push(
            this.userService.afterLogin.subscribe(() => {
                this.dialogLogin().close();
                this.edit.logged = true;
                this.edit.saveServer();
            }),
        );
    }

    ngOnDestroy() {
        this._sub.clear();
    }

    open() {
        this.dialogLogin().open();
    }
}
