import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';

import { MessageError } from '../content/user/user.interface';


export abstract class APICommon {
    abstract token?: string;

    constructor(protected translate: TranslateService) {}

    protected header(): {} {
        return {
            withCredentials: true,
            headers: new HttpHeaders({
                'X-AUTH-TOKEN': this.token ?? '',
            }),
        };
    }

    protected error(message: string, result: HttpErrorResponse) {
        console.error(message, result);
        return this.translate.instant(`error.api-code.${(result.error as MessageError).errorCode}`);
    }
}
