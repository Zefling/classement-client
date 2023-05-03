import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

/**
 * @link from https://stackoverflow.com/questions/50250361/how-to-elegantly-get-full-url-from-the-activatedroutesnapshot
 * @param route ActivatedRouteSnapshot
 * @returns full path
 */
function getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot.map(v => v.url.map(segment => segment.toString()).join('/')).join('/');
}

@Injectable({ providedIn: 'root' })
export class APIRequired  {
    canActivate(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return environment.api?.active;
    }
}
