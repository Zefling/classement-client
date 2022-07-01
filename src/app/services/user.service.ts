import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment';

import { Login, Message, MessageError } from '../content/user/user.interface';
import { Classement, User } from '../interface';
import { Utils } from '../tools/utils';


@Injectable({ providedIn: 'root' })
export class UserService {
    afterLoggin = new Subject<void>();

    logged = false;

    user?: User;

    token?: string;

    constructor(private http: HttpClient, private router: Router, private translate: TranslateService) {}

    isLogged(): Promise<void> {
        return new Promise<void>(resolve => {
            if (this.logged) {
                resolve();
            } else {
                this.afterLoggin.subscribe(() => {
                    resolve();
                });
            }
        });
    }

    initProfile(first: boolean = false): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.token = Utils.getCookie('x-token') || undefined;

            if (this.token) {
                this.http.get<Message<User>>(environment.api.path + 'api/user/current', this.header()).subscribe({
                    next: result => {
                        console.log('valide token', result.message);
                        this.user = result.message;
                        this.logged = true;
                        resolve();
                    },
                    error: (result: HttpErrorResponse) => {
                        console.error('invalide token', result);
                        reject(this.translate.instant('error.api-code.' + (result.error as MessageError).errorCode));
                    },
                    complete: () => {
                        this.afterLoggin.next();
                    },
                });
            }
        });
    }

    login(username: string, password: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http
                .post<Message<Login>>(environment.api.path + 'api/login', {
                    username: username,
                    password: password,
                })
                .subscribe({
                    next: result => {
                        this.token = result.message.token;
                        this.logged = true;

                        Utils.setCookie('x-token', this.token);

                        this.initProfile()
                            .then(() => {
                                resolve();
                            })
                            .catch(errorCode => {
                                reject(this.translate.instant('error.api-code.' + errorCode));
                            });
                    },
                    error: (result: HttpErrorResponse) => {
                        console.error('login', result);
                        reject(this.translate.instant('error.api-code.' + (result.error as MessageError).errorCode));
                    },
                });
        });
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

    private header(): {} {
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
