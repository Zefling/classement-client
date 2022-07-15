import { Injectable, Optional } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';

import { APIUserService } from './api.user.service';


export enum Role {
    USER = 'ROLE_USER',
    MODERATOR = 'ROLE_MODERATOR',
    ADMIN = 'ROLE_ADMIN',
}
export const rolesModerator = [Role.MODERATOR, Role.ADMIN];

@Injectable({ providedIn: 'root' })
export class APIModeration implements CanActivate {
    constructor(@Optional() private usernameService: APIUserService) {}

    canActivate(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return (
            this.usernameService?.user?.roles?.includes(Role.MODERATOR) ||
            this.usernameService?.user?.roles?.includes(Role.ADMIN) ||
            false
        );
    }
}
