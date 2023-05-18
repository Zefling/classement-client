import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, HostBinding, Input } from '@angular/core';

import { Classement } from 'src/app/interface';

@Component({
    selector: 'navigate-result',
    templateUrl: './navigate-result.component.html',
    styleUrls: ['./navigate-result.component.scss'],
})
export class NavigateResultComponent {
    @Input() classements: Classement[] = [];

    @Input()
    public get hideDerivatives(): boolean {
        return this._hideDerivatives;
    }
    public set hideDerivatives(value: any) {
        this._hideDerivatives = coerceBooleanProperty(value);
    }

    @Input()
    public get hideUser(): boolean {
        return this._hideUser;
    }
    public set hideUser(value: any) {
        this._hideUser = coerceBooleanProperty(value);
    }

    @Input()
    public get onlyRanking(): boolean {
        return this._onlyRanking;
    }
    public set onlyRanking(value: any) {
        this._onlyRanking = coerceBooleanProperty(value);
    }

    @HostBinding('class.categories')
    @Input()
    public get isCatagoryList(): boolean {
        return this._isCatagoryList;
    }
    public set isCatagoryList(value: any) {
        this._isCatagoryList = coerceBooleanProperty(value);
    }

    private _hideDerivatives = false;
    private _hideUser = false;
    private _isCatagoryList = false;
    private _onlyRanking = false;
}
