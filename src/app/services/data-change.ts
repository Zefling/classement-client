import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';

import { GlobalService } from './global.service';


@Injectable({ providedIn: 'root' })
export class DataChange implements CanActivate {
    constructor(private router: Router, private global: GlobalService) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.global.withChange) {
            let path = route.routeConfig?.path;
            for (const id in route.params) {
                path = path?.replace(':' + id, route.params[id]);
            }
            this.global.forceExit(route.routeConfig?.path);
            return false;
        }
        return true;
    }
}
