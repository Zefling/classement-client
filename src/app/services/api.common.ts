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
                // 'Access-Control-Allow-Origin': '*',
                // 'Content-Type': 'application/json',
                // userLoginToken: 'Content-Type',
                // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                // 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                // 'Access-Control-Allow-Credentials': 'false',
                // 'strict-origin-when-cross-origin': environment.api.domain,
            }),
        };
    }

    protected error(message: string, result: HttpErrorResponse) {
        console.error(message, result);
        return this.translate.instant(`error.api-code.${(result.error as MessageError).errorCode}`);
    }
}
