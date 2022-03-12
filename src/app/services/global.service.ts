import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class GlobalService {
    readonly onForceExit = new Subject<string | undefined>();

    withChange = false;

    forceExit(route: string | undefined) {
        this.onForceExit.next(route);
    }
}
