import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Classement, User } from 'src/app/interface';
import { UserService } from 'src/app/services/user.service';


@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnDestroy {
    user?: User;

    listener: Subscription[] = [];

    constructor(private router: Router, private userService: UserService) {
        this.listener.push(
            this.userService.afterLoggin.subscribe(() => {
                if (!this.userService.logged) {
                    this.router.navigate(['/profil/login']);
                } else {
                    this.user = this.userService.user;
                }
            }),
        );

        this.user = this.userService.user;
    }

    ngOnDestroy(): void {
        this.listener.forEach(e => e.unsubscribe());
    }

    delete(classement: Classement) {
        this.userService.deleteClassement(classement.rankingId).then(() => {
            this.user?.classements.splice(this.user?.classements.indexOf(classement), 1);
        });
    }
}
