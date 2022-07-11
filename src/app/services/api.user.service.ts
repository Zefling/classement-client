import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment';

import { APICommon } from './api.common';

import { Login, Message, MessageError } from '../content/user/user.interface';
import { Classement, User } from '../interface';
import { Utils } from '../tools/utils';


@Injectable({ providedIn: 'root' })
export class APIUserService extends APICommon {
    afterLoggin = new Subject<void>();
    afterLogout = new Subject<void>();

    logged?: boolean;

    user?: User;

    token?: string;

    constructor(private http: HttpClient, private translate: TranslateService) {
        super();
    }

    updateClassement(classement: Classement) {
        if (this.user && Array.isArray(this.user.classements)) {
            let index = this.user.classements.findIndex(e => e.rankingId === classement.rankingId);
            if (index !== -1) {
                this.user.classements[index] = classement;
            }
        }
    }

    loggedStatus(): Promise<void> {
        return new Promise<void>(resolve => {
            if (this.logged !== undefined) {
                resolve();
            } else {
                this.afterLoggin.subscribe(() => {
                    resolve();
                });
            }
        });
    }

    initProfile(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.token = Utils.getCookie('x-token') || undefined;
            if (this.token) {
                this.http.get<Message<User>>(`${environment.api.path}api/user/current`, this.header()).subscribe({
                    next: result => {
                        console.log('valide token', result.message);
                        this.user = result.message;
                        if (this.user.classements?.length) {
                            this.user.classements = this.user.classements.sort(
                                (a, b) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime(),
                            );
                        }
                        this.logged = true;
                        resolve();
                    },
                    error: (result: HttpErrorResponse) => {
                        console.error('invalide token', result);
                        this.logged = false;
                        reject(this.translate.instant(`error.api-code.${(result.error as MessageError).errorCode}`));
                    },
                    complete: () => {
                        this.afterLoggin.next();
                    },
                });
            }
        });
    }

    signup(username: string, password: string, email: string) {
        return new Promise<void>((resolve, reject) => {
            this.http
                .post<Message<Login>>(`${environment.api.path}api/signup`, { username, password, email })
                .subscribe({
                    next: result => {
                        console.log(result);
                        resolve();
                    },
                    error: (result: HttpErrorResponse) => {
                        console.error('signup', result);
                        reject(this.translate.instant(`error.api-code.${(result.error as MessageError).errorCode}`));
                    },
                });
        });
    }

    login(username: string, password: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.post<Message<Login>>(`${environment.api.path}api/login`, { username, password }).subscribe({
                next: result => {
                    this.token = result.message.token;
                    this.logged = true;

                    Utils.setCookie('x-token', this.token);

                    this.initProfile()
                        .then(() => {
                            resolve();
                        })
                        .catch(errorCode => {
                            reject(this.translate.instant(`error.api-code.${errorCode}`));
                        });
                },
                error: (result: HttpErrorResponse) => {
                    console.error('login', result);
                    this.afterLogout.next();
                    reject(this.translate.instant(`error.api-code.${(result.error as MessageError).errorCode}`));
                },
            });
        });
    }

    logout() {
        return new Promise<void>((resolve, reject) => {
            this.http.delete<Message<Login>>(`${environment.api.path}api/logout`, this.header()).subscribe({
                next: () => {
                    this.token = undefined;
                    this.logged = false;

                    Utils.removeCookie('x-token');

                    this.afterLogout.next();
                    resolve();
                },
                error: (result: HttpErrorResponse) => {
                    console.error('logout', result);
                    reject(this.translate.instant(`error.api-code.${(result.error as MessageError).errorCode}`));
                },
            });
        });
    }

    test(type: 'username' | 'email', value: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let param: any = {};
            param[type] = value;
            this.http.post<Message<boolean>>(`${environment.api.path}api/test`, param).subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    console.error('login', result);
                    reject(this.translate.instant(`error.api-code.${(result.error as MessageError).errorCode}`));
                },
            });
        });
    }
}
