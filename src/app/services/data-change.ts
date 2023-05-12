import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';

import { GlobalService } from './global.service';

/**
 * @link from https://stackoverflow.com/questions/50250361/how-to-elegantly-get-full-url-from-the-activatedroutesnapshot
 * @param route ActivatedRouteSnapshot
 * @returns full path
 */
function getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot.map(v => v.url.map(segment => segment.toString()).join('/')).join('/');
}

@Injectable({ providedIn: 'root' })
export class DataChange {
    constructor(private readonly global: GlobalService) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.global.withChange) {
            this.global.forceExit(getResolvedUrl(route));
            return false;
        }
        return true;
    }
}
