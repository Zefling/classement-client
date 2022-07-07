import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { environment } from 'src/environments/environment';

import { APICommon } from './api.common';
import { APIUserService } from './api.user.service';

import { Message, MessageError } from '../content/user/user.interface';
import { Classement } from '../interface';


@Injectable({ providedIn: 'root' })
export class APIClassementService extends APICommon {
    get token(): string {
        return this.userService.token!;
    }

    constructor(private http: HttpClient, private userService: APIUserService, private translate: TranslateService) {
        super();
    }

    getClassement(rankingId: string): Promise<Classement> {
        return new Promise<Classement>((resolve, reject) => {
            this.http
                .get<Message<Classement>>(environment.api.path + 'api/classement/' + rankingId, this.header())
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        console.error('login', result);
                        reject(this.translate.instant('error.api-code.' + (result.error as MessageError).errorCode));
                    },
                });
        });
    }

    getClassementsByOptions(options: { name?: string; category?: string }): Promise<Classement[]> {
        return new Promise<Classement[]>((resolve, reject) => {
            let params = new HttpParams();
            for (const i in options) {
                if ((options as any)[i] !== undefined) {
                    params = params.set(i, (options as any)[i]);
                }
            }
            console.log('options', options, 'params', params);

            this.http.get<Message<Classement[]>>(environment.api.path + 'api/classements', { params }).subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    console.error('login', result);
                    reject(this.translate.instant('error.api-code.' + (result.error as MessageError).errorCode));
                },
            });
        });
    }

    getClassementsHome(): Promise<Classement[]> {
        return new Promise<Classement[]>((resolve, reject) => {
            this.http.get<Message<Classement[]>>(environment.api.path + 'api/categories/home').subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    console.error('login', result);
                    reject(this.translate.instant('error.api-code.' + (result.error as MessageError).errorCode));
                },
            });
        });
    }

    deleteClassement(rankingId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http
                .delete<Message<void>>(environment.api.path + 'api/classement/' + rankingId, this.header())
                .subscribe({
                    next: _ => {
                        resolve();
                    },
                    error: (result: HttpErrorResponse) => {
                        console.error('login', result);
                        reject(this.translate.instant('error.api-code.' + (result.error as MessageError).errorCode));
                    },
                });
        });
    }
}
