import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/interface';
import { APIUserService } from 'src/app/services/api.user.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

@Component({
    selector: 'user-view',
    templateUrl: './user-view.component.html',
    styleUrls: ['./user-view.component.scss'],
})
export class UserViewComponent {
    user?: User;

    listener = Subscriptions.instance();

    constructor(private route: ActivatedRoute, private router: Router, private userService: APIUserService) {
        this.listener.push(
            this.route.params.subscribe(params => {
                if (params['id']?.startsWith('@')) {
                    this.userService
                        .getUser(params['id'].substring(1))
                        .then(user => {
                            this.user = user;

                            user.classements?.sort((a, b) => {
                                return (
                                    (new Date(b.dateChange)?.getTime() || new Date(b.dateCreate).getTime()) -
                                    (new Date(a.dateChange)?.getTime() || new Date(a.dateCreate).getTime())
                                );
                            });
                        })
                        .catch(() => {
                            this.router.navigate(['/']);
                        });
                } else {
                    this.router.navigate(['/']);
                }
            }),
        );
    }

    ngOnDestroy(): void {
        this.listener.clear();
    }
}
