import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, inject, viewChild } from '@angular/core';
import { ɵEmptyOutletComponent } from '@angular/router';

import { MagmaDialog, Subscriptions } from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { ClassementEditComponent } from './../classement-edit.component';

import { APIUserService } from '../../../services/api.user.service';
import { UserLoginComponent } from '../../user/user-login.component';

@Component({
    selector: 'classement-login',
    templateUrl: './classement-login.component.html',
    styleUrls: ['./classement-login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MagmaDialog, NgComponentOutlet, ɵEmptyOutletComponent, TranslocoPipe],
})
export class ClassementLoginComponent implements OnDestroy {
    private readonly edit = inject(ClassementEditComponent, { host: true });
    private readonly userService = inject(APIUserService);

    dialogLogin = viewChild.required<MagmaDialog>('dialogLogin');

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
