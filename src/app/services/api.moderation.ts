import { Injectable, Optional } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';

import { APIUserService } from './api.user.service';

export enum Role {
    USER = 'ROLE_USER',
    MODERATOR = 'ROLE_MODERATOR',
    ADMIN = 'ROLE_ADMIN',
    BANNED = 'ROLE_BANNED',
}
export const rolesModerator = [Role.MODERATOR, Role.ADMIN];

@Injectable({ providedIn: 'root' })
export class APIModeration  {
    constructor(@Optional() private userService: APIUserService) {}

    canActivate(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return new Promise<boolean>(resolve => {
            this.userService
                .initProfile()
                .then(() => {
                    resolve(
                        this.userService?.user?.roles?.includes(Role.MODERATOR) ||
                            this.userService?.user?.roles?.includes(Role.ADMIN) ||
                            false,
                    );
                })
                .catch(() => {
                    resolve(false);
                });
        });
    }
}
