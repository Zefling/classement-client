import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/interface/interface';
import { APIUserService } from 'src/app/services/api.user.service';
import { Logger } from 'src/app/services/logger';
import { Subscriptions } from 'src/app/tools/subscriptions';

@Component({
    selector: 'user-view',
    templateUrl: './user-view.component.html',
    styleUrls: ['./user-view.component.scss'],
})
export class UserViewComponent {
    user?: User;

    loading = false;

    listener = Subscriptions.instance();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly userService: APIUserService,
        private readonly logger: Logger,
    ) {
        this.listener.push(
            this.route.params.subscribe(async params => {
                this.loading = true;
                try {
                    if (params['id']?.startsWith('@')) {
                        this.user = await this.userService.getUser(params['id'].substring(1));

                        this.user.classements?.sort(
                            (a, b) =>
                                (new Date(b.dateChange)?.getTime() || new Date(b.dateCreate).getTime()) -
                                (new Date(a.dateChange)?.getTime() || new Date(a.dateCreate).getTime()),
                        );
                        this.loading = false;
                    }
                } finally {
                    if (this.loading) {
                        this.logger.log('Profil loading error');
                        this.router.navigate(['/']);
                    }
                }
            }),
        );
    }

    ngOnDestroy(): void {
        this.listener.clear();
    }
}
