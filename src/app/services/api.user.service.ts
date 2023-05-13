import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment';

import { APICommon } from './api.common';
import { Role } from './api.moderation';
import { GlobalService } from './global.service';
import { Logger, LoggerLevel } from './logger';

import { Login, Message, MessageError } from '../content/user/user.interface';
import { Classement, User } from '../interface';
import { Utils } from '../tools/utils';

@Injectable({ providedIn: 'root' })
export class APIUserService extends APICommon {
    afterLoggin = new Subject<void>();
    afterLogout = new Subject<void>();

    logged?: boolean;

    user?: User;
    isModerator = false;
    isAdmin = false;

    token?: string;

    private cache: Classement[] = [];

    constructor(
        private readonly http: HttpClient,
        private readonly globalService: GlobalService,
        translate: TranslateService,
        logger: Logger,
    ) {
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
                        reject(this.error('invalide token', result));
                    },
                    complete: () => {
                        this.afterLoggin.next();
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
                        reject(this.error('signup', result));
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
                    reject(this.error('userValidate', result));
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
                    reject(this.error('login', result));
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
                    reject(this.error('login', result));
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
                        reject(this.error('passwordLost', result));
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
                        reject(this.error('passwordLost', result));
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
                    reject(this.error('logout', result));
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

    update(oldValue: string, newValue: string, type: 'email' | 'password'): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let param: any = {};
            param[type + 'Old'] = oldValue;
            param[type + 'New'] = newValue;
            this.http
                .post<Message<void>>(`${environment.api.path}api/user/update/${type}`, param, this.header())
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

    remove(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.delete<Message<User>>(`${environment.api.path}api/user`, this.header()).subscribe({
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
                .post<Message<{ avatar: boolean; url: string }>>(
                    `${environment.api.path}api/user/update/avatar`,
                    param,
                    this.header(),
                )
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

    adminGetUsers(page: number = 1): Promise<{ total: number; list: User[] }> {
        return new Promise<{ total: number; list: User[] }>((resolve, reject) => {
            let params = new HttpParams().set('page', page);
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
                        reject(this.error('adminGetUser', result));
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
                        reject(this.error('adminUpdateUser', result));
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
                    reject(this.error('adminRemoveUser', result));
                },
            });
        });
    }

    sendToAdmin(username: string, email: string, message: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http
                .post<Message<void>>(`${environment.api.path}api/contact`, { username, email, message })
                .subscribe({
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
