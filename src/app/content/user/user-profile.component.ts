import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Classement, User } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';


@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnDestroy {
    user?: User;

    listener: Subscription[] = [];

    constructor(
        private router: Router,
        private userService: APIUserService,
        private classementService: APIClassementService,
    ) {
        this.listener.push(
            this.userService.afterLoggin.subscribe(() => {
                if (!this.userService.logged) {
                    this.router.navigate(['/profil/login']);
                } else {
                    this.user = this.userService.user;
                }
            }),
            this.userService.afterLogout.subscribe(() => {
                this.router.navigate(['/user/login']);
            }),
        );

        if (!this.userService.token) {
            this.router.navigate(['/user/login']);
        }

        this.user = this.userService.user;
    }

    ngOnDestroy(): void {
        this.listener.forEach(e => e.unsubscribe());
    }

    delete(classement: Classement) {
        this.classementService.deleteClassement(classement.rankingId).then(() => {
            this.user?.classements.splice(this.user?.classements.indexOf(classement), 1);
        });
    }
}
