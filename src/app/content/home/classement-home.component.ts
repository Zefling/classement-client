import { Component } from '@angular/core';

import { Subscription } from 'rxjs';

import { APIUserService } from 'src/app/services/api.user.service';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'classement-home',
    templateUrl: './classement-home.component.html',
    styleUrls: ['./classement-home.component.scss'],
})
export class ClassementHomeComponent {
    version = '1.3.1';

    modeApi = environment.api?.active || false;

    logged = false;

    private listener: Subscription[] = [];

    constructor(private userService: APIUserService) {
        this.logged = !!this.userService.logged;
    }

    ngOnDestroy(): void {
        this.listener.forEach(e => e.unsubscribe());
    }
}
