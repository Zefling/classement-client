import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment';

import { APICommon } from './api.common';
import { Role } from './api.moderation';
import { GlobalService } from './global.service';
import { Logger, LoggerLevel } from './logger';

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
            this.http.get<Message<User>>(`${environment.api.path}api/test`).subscribe({
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
            this.token = Utils.getCookie('x-token') || undefined;
            if (this.token) {
                this.http.get<Message<User>>(`${environment.api.path}api/user/current`, this.header()).subscribe({
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
                            Utils.removeCookie('x-token');
                        }
                        reject(this.logger.error('invalide token', result));
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
                .post<Message<Login>>(`${environment.api.path}api/${this.globalService.lang}/signup`, {
                    username,
                    password,
                    email,
                })
                .subscribe({
                    next: _ => {
                        resolve();
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.logger.error('signup', result));
                    },
                });
        });
    }

    userValidate(token: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.get<Message<Login>>(`${environment.api.path}api/signup/validity/${token}`).subscribe({
                next: _ => {
                    resolve();
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.logger.error('userValidate', result));
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
                            if ((errorCode.error as MessageError).errorCode === 1030) {
                                Utils.removeCookie('x-token');
                            }
                            reject(errorCode);
                        });
                },
                error: (result: HttpErrorResponse) => {
                    this.afterLogout.next();
                    reject(this.logger.error('login', result));
                },
            });
        });
    }

    loginOauth(token: string, service: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.post<Message<Login>>(`${environment.api.path}api/login/oauth`, { token, service }).subscribe({
                next: result => {
                    this.token = result.message.token;
                    this.logged = true;

                    Utils.setCookie('x-token', this.token);

                    this.initProfile()
                        .then(() => {
                            resolve();
                        })
                        .catch((errorCode: HttpErrorResponse) => {
                            if ((errorCode.error as MessageError).errorCode === 1030) {
                                Utils.removeCookie('x-token');
                            }
                            reject(errorCode);
                        });
                },
                error: (result: HttpErrorResponse) => {
                    this.afterLogout.next();
                    reject(this.logger.error('login', result));
                },
            });
        });
    }

    passwordLost(identifier: string) {
        return new Promise<void>((resolve, reject) => {
            this.http
                .post<Message<Login>>(`${environment.api.path}api/${this.globalService.lang}/password-lost`, {
                    identifier,
                })
                .subscribe({
                    next: _ => {
                        resolve();
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.logger.error('passwordLost', result));
                    },
                });
        });
    }

    passwordChange(password: string, token: string) {
        return new Promise<void>((resolve, reject) => {
            this.http
                .post<Message<Login>>(`${environment.api.path}api/password-change`, {
                    password,
                    token,
                })
                .subscribe({
                    next: _ => {
                        resolve();
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.logger.error('passwordLost', result));
                    },
                });
        });
    }

    logout() {
        return new Promise<void>((resolve, reject) => {
            this.http.delete<Message<Login>>(`${environment.api.path}api/logout`, this.header()).subscribe({
                next: () => {
                    this.reset();
                    Utils.removeCookie('x-token');
                    this.afterLogout.next();
                    resolve();
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.logger.error('logout', result));
                },
            });
        });
    }

    test(type: 'username' | 'email', value: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let param: any = {};
            param[type] = value;
            this.http.post<boolean>(`${environment.api.path}api/test`, param).subscribe({
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
            this.http
                .post<Message<void>>(`${environment.api.path}api/user/update/${type}`, param, this.header())
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.logger.error('update', result));
                    },
                });
        });
    }

    remove(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.delete<Message<User>>(`${environment.api.path}api/user`, this.header()).subscribe({
                next: _ => {
                    resolve();
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.logger.error('remove', result));
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
                >(`${environment.api.path}api/user/update/avatar`, param, this.header())
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.logger.error('update', result));
                    },
                });
        });
    }

    getUser(userId: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.http.get<Message<User>>(`${environment.api.path}api/profile/${userId}`).subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.logger.error('getUser', result));
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
                .get<Message<{ total: number; list: User[] }>>(`${environment.api.path}api/admin/users`, {
                    params,
                    ...this.header(),
                })
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.logger.error('adminGetUser', result));
                    },
                });
        });
    }

    adminUpdateUser(id: number, param: {}) {
        return new Promise<User>((resolve, reject) => {
            this.http
                .post<Message<User>>(`${environment.api.path}api/admin/user/${id}`, param, this.header())
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.logger.error('adminUpdateUser', result));
                    },
                });
        });
    }

    adminRemoveUser(id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.delete<Message<User>>(`${environment.api.path}api/admin/user/${id}`, this.header()).subscribe({
                next: _ => {
                    resolve();
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.logger.error('adminRemoveUser', result));
                },
            });
        });
    }

    sendToAdmin(params: { username: string; email: string; message: string }): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.post<Message<void>>(`${environment.api.path}api/contact`, params).subscribe({
                next: _ => {
                    resolve();
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.logger.error('sendToAdmin', result));
                },
            });
        });
    }
}
