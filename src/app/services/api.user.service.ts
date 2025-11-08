import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Logger, LoggerLevel, getCookie, removeCookie, setCookie } from '@ikilote/magma';
import { TranslocoService } from '@jsverse/transloco';

import { Subject } from 'rxjs';

import { APICommon } from './api.common';
import { Role } from './api.moderation';
import { GlobalService } from './global.service';

import { Classement, Login, Message, MessageError, SortDirection, SortUserCol, User } from '../interface/interface';
import { Utils } from '../tools/utils';

@Injectable({ providedIn: 'root' })
export class APIUserService extends APICommon {
    private readonly http = inject(HttpClient);
    private readonly globalService = inject(GlobalService);

    afterLogin = new Subject<void>();
    afterLogout = new Subject<void>();

    logged?: boolean;

    user?: User;
    isModerator = false;
    isAdmin = false;

    token?: string;

    private cache: Classement[] = [];

    constructor() {
        const translate = inject(TranslocoService);
        const logger = inject(Logger);

        super(translate, logger);
    }

    reset() {
        this.token = undefined;
        this.logged = false;
        this.isModerator = false;
        this.isAdmin = false;
        this.user = undefined;
    }

    addCache(classement: Classement) {
        this.cache.push(classement);
    }

    getByIdFormCache(id: string): Classement | undefined {
        return this.cache.find(e => e.rankingId === id);
    }

    updateClassement(classement: Classement) {
        Utils.updateClassements(this.user?.classements, [classement], this.user);
        if (this.user?.classements) {
            this.user.classements.forEach(d => {
                if (typeof d.dateCreate === 'string') {
                    d.dateCreate = new Date(d.dateCreate);
                } else if (d.dateChange && typeof d.dateChange === 'string') {
                    d.dateChange = new Date(d.dateChange);
                }
            });
            this.user.classements.sort((e, f) => new Date(f.dateCreate).getTime() - (e.dateCreate as Date).getTime());
        }
    }

    loggedStatus(): Promise<void> {
        return new Promise<void>(resolve => {
            if (this.logged !== undefined) {
                resolve();
            } else {
                this.afterLogin.subscribe(() => {
                    resolve();
                });
            }
        });
    }

    serverTest() {
        return new Promise<void>((resolve, reject) => {
            this.http.get<Message<User>>(this.apiPath(`test`)).subscribe({
                next: () => {
                    resolve();
                },
                error: () => {
                    reject();
                },
            });
        });
    }

    initProfile(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.token = getCookie('x-token') || undefined;
            if (this.token) {
                this.http.get<Message<User>>(this.apiPath(`user/current`), this.header()).subscribe({
                    next: result => {
                        this.logger.log('valide token', LoggerLevel.log, result.message);
                        this.user = result.message;
                        if (this.user.classements?.length) {
                            this.user.classements = this.user.classements.sort(
                                (a, b) => new Date(b.dateCreate).getTime() - new Date(a.dateCreate).getTime(),
                            );
                        }
                        this.logged = true;
                        this.isModerator = this.user.roles?.includes(Role.MODERATOR) || false;
                        this.isAdmin = this.user.roles?.includes(Role.ADMIN) || false;
                        resolve();
                    },
                    error: (result: HttpErrorResponse) => {
                        this.logged = false;
                        if ((result.error as MessageError).errorCode === 1030) {
                            removeCookie('x-token');
                        }
                        reject(this.error('invalide token', result));
                    },
                    complete: () => {
                        this.afterLogin.next();
                    },
                });
            } else {
                this.logged = false;
                resolve();
            }
        });
    }

    signup(username: string, password: string, email: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http
                .post<Message<Login>>(this.apiPath(`${this.globalService.lang}/signup`), {
                    username,
                    password,
                    email,
                })
                .subscribe({
                    next: _ => {
                        resolve();
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.error('signup', result));
                    },
                });
        });
    }

    userValidate(token: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.get<Message<Login>>(this.apiPath(`signup/validity/${token}`)).subscribe({
                next: _ => {
                    resolve();
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.error('userValidate', result));
                },
            });
        });
    }

    login(username: string, password: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.post<Message<Login>>(this.apiPath(`login`), { username, password }).subscribe({
                next: result => {
                    this.token = result.message.token;
                    this.logged = true;

                    setCookie('x-token', this.token);

                    this.initProfile()
                        .then(() => {
                            resolve();
                        })
                        .catch(errorCode => {
                            if ((errorCode.error as MessageError).errorCode === 1030) {
                                removeCookie('x-token');
                            }
                            reject(errorCode);
                        });
                },
                error: (result: HttpErrorResponse) => {
                    this.afterLogout.next();
                    reject(this.error('login', result));
                },
            });
        });
    }

    loginOauth(token: string, service: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.post<Message<Login>>(this.apiPath(`login/oauth`), { token, service }).subscribe({
                next: result => {
                    this.token = result.message.token;
                    this.logged = true;

                    setCookie('x-token', this.token);

                    this.initProfile()
                        .then(() => {
                            resolve();
                        })
                        .catch((errorCode: HttpErrorResponse) => {
                            if ((errorCode.error as MessageError).errorCode === 1030) {
                                removeCookie('x-token');
                            }
                            reject(errorCode);
                        });
                },
                error: (result: HttpErrorResponse) => {
                    this.afterLogout.next();
                    reject(this.error('login', result));
                },
            });
        });
    }

    passwordLost(identifier: string) {
        return new Promise<void>((resolve, reject) => {
            this.http
                .post<Message<Login>>(this.apiPath(`${this.globalService.lang}/password-lost`), {
                    identifier,
                })
                .subscribe({
                    next: _ => {
                        resolve();
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.error('passwordLost', result));
                    },
                });
        });
    }

    passwordChange(password: string, token: string) {
        return new Promise<void>((resolve, reject) => {
            this.http
                .post<Message<Login>>(this.apiPath(`password-change`), {
                    password,
                    token,
                })
                .subscribe({
                    next: _ => {
                        resolve();
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.error('passwordLost', result));
                    },
                });
        });
    }

    logout() {
        return new Promise<void>((resolve, reject) => {
            this.http.delete<Message<Login>>(this.apiPath(`logout`), this.header()).subscribe({
                next: () => {
                    this.reset();
                    removeCookie('x-token');
                    this.afterLogout.next();
                    resolve();
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.error('logout', result));
                },
            });
        });
    }

    test(type: 'username' | 'email', value: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let param: any = {};
            param[type] = value;
            this.http.post<boolean>(this.apiPath(`test`), param).subscribe({
                next: result => {
                    resolve(result);
                },
                error: () => {
                    reject();
                },
            });
        });
    }

    update(oldValue: string, newValue: string, type: 'email' | 'password' | 'username'): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let param: any = {};
            if (type === 'username') {
                param[type] = newValue;
            } else {
                param[type + 'Old'] = oldValue;
                param[type + 'New'] = newValue;
            }
            this.http.post<Message<void>>(this.apiPath(`user/update/${type}`), param, this.header()).subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.error('update', result));
                },
            });
        });
    }

    remove(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.delete<Message<User>>(this.apiPath(`user`), this.header()).subscribe({
                next: _ => {
                    resolve();
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.error('remove', result));
                },
            });
        });
    }

    updateAvatar(avatar: string): Promise<{ avatar: boolean; url: string }> {
        return new Promise<{ avatar: boolean; url: string }>((resolve, reject) => {
            let param: any = {
                avatar,
            };
            this.http
                .post<
                    Message<{ avatar: boolean; url: string }>
                >(this.apiPath(`user/update/avatar`), param, this.header())
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.error('update', result));
                    },
                });
        });
    }

    getUser(userId: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.http.get<Message<User>>(this.apiPath(`profile/${userId}`)).subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.error('getUser', result));
                },
            });
        });
    }

    adminGetUsers(
        page: number = 1,
        sort: SortUserCol,
        direction: SortDirection,
        username?: string,
    ): Promise<{ total: number; list: User[] }> {
        return new Promise<{ total: number; list: User[] }>((resolve, reject) => {
            let params = new HttpParams().set('page', page).set('order', sort).set('direction', direction);

            if (username) {
                params = params.set('username', username);
            }

            this.http
                .get<Message<{ total: number; list: User[] }>>(this.apiPath(`admin/users`), {
                    params,
                    ...this.header(),
                })
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.error('adminGetUser', result));
                    },
                });
        });
    }

    adminUpdateUser(id: number, param: {}) {
        return new Promise<User>((resolve, reject) => {
            this.http.post<Message<User>>(this.apiPath(`admin/user/${id}`), param, this.header()).subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.error('adminUpdateUser', result));
                },
            });
        });
    }

    adminRemoveUser(id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.delete<Message<User>>(this.apiPath(`admin/user/${id}`), this.header()).subscribe({
                next: _ => {
                    resolve();
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.error('adminRemoveUser', result));
                },
            });
        });
    }

    sendToAdmin(params: { username: string; email: string; message: string }): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.post<Message<void>>(this.apiPath(`contact`), params).subscribe({
                next: _ => {
                    resolve();
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.error('sendToAdmin', result));
                },
            });
        });
    }
}
