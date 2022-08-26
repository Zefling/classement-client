import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment';

import { APICommon } from './api.common';
import { Role } from './api.moderation';
import { GlobalService } from './global.service';

import { Login, Message } from '../content/user/user.interface';
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

    constructor(private http: HttpClient, translate: TranslateService, private globalService: GlobalService) {
        super(translate);
    }

    reset() {
        this.token = undefined;
        this.logged = false;
        this.isModerator = false;
        this.isAdmin = false;
        this.user = undefined;
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
                        this.isModerator = this.user.roles?.includes(Role.MODERATOR) || false;
                        this.isAdmin = this.user.roles?.includes(Role.ADMIN) || false;
                        resolve();
                    },
                    error: (result: HttpErrorResponse) => {
                        this.logged = false;
                        reject(this.error('invalide token', result));
                    },
                    complete: () => {
                        this.afterLoggin.next();
                    },
                });
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
                            reject(this.translate.instant(`error.api-code.${errorCode}`));
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
            this.http.post<Message<boolean>>(`${environment.api.path}api/test`, param).subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.error('login', result));
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
