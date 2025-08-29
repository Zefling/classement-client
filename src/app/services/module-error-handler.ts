import { Injectable, inject } from '@angular/core';

import { Logger } from '@ikilote/magma';

import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModuleErrorHandler {
    private readonly logger = inject(Logger);

    readonly reload = new Subject<void>();

    constructor() {
        window.addEventListener('error', event => {
            if (
                event.message.includes('error loading dynamically imported module') ||
                event.message.includes('Failed to fetch dynamically imported module')
            ) {
                this.logger.warn('ModuleErrorHandler', 'A dynamic module could not be loaded.');
                this.reload.next();
            }
        });
    }
}
