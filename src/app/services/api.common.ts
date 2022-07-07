import { HttpHeaders } from '@angular/common/http';


export abstract class APICommon {
    abstract token?: string;

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
}
