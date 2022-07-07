import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { APIUserService } from 'src/app/services/api.user.service';


@Component({
    selector: 'user-pw-lost',
    templateUrl: './user-pw-lost.component.html',
    styleUrls: ['./user-pw-lost.component.scss'],
})
export class UserPwLostComponent implements OnDestroy {
    email = '';
    showError = '';

    listener: Subscription[] = [];

    constructor(private router: Router, private userService: APIUserService) {
        this.listener.push(
            this.userService.afterLoggin.subscribe(() => {
                if (this.userService.logged) {
                    this.router.navigate(['/user/profile']);
                }
            }),
        );
    }

    ngOnDestroy(): void {
        this.listener.forEach(e => e.unsubscribe());
    }

    submit() {
        // this.userService
        //     .login(this.username, this.password)
        //     .then(() => {
        //         this.router.navigate(['/user/profile']);
        //     })
        //     .catch(e => {
        //         this.showError = e;
        //     });
    }
}
