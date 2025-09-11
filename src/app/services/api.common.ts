import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Logger, LoggerLevel } from '@ikilote/magma';
import { TranslocoService } from '@jsverse/transloco';

import { environment } from 'src/environments/environment';

import { MessageError } from '../interface/interface';

export abstract class APICommon {
    abstract token?: string;

    constructor(
        protected readonly translate: TranslocoService,
        protected readonly logger: Logger,
    ) {}

    protected header(): {} {
        return {
            withCredentials: true,
            headers: new HttpHeaders({
                'X-AUTH-TOKEN': this.token ?? '',
            }),
        };
    }

    protected apiPath(path: string) {
        return `${environment.api.path}api/${path}`;
    }

    protected error(message: string, result: HttpErrorResponse) {
        if (!environment.production) {
            this.logger.log(message, LoggerLevel.error, result);
        }
        return this.translate.translate(`error.api-code.${(result.error as MessageError).errorCode}`);
    }
}
