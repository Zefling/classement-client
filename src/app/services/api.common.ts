import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';

import { Logger, LoggerLevel } from './logger';

import { MessageError } from '../content/user/user.interface';


export abstract class APICommon {
    abstract token?: string;

    constructor(protected translate: TranslateService, protected logger: Logger) {}

    protected header(): {} {
        return {
            withCredentials: true,
            headers: new HttpHeaders({
                'X-AUTH-TOKEN': this.token ?? '',
            }),
        };
    }

    protected error(message: string, result: HttpErrorResponse) {
        this.logger.log(message, LoggerLevel.error, result);
        return this.translate.instant(`error.api-code.${(result.error as MessageError).errorCode}`);
    }
}
