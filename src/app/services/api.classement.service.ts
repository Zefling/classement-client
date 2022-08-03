import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { environment } from 'src/environments/environment';

import { APICommon } from './api.common';
import { APIUserService } from './api.user.service';

import { Message } from '../content/user/user.interface';
import { Classement } from '../interface';


@Injectable({ providedIn: 'root' })
export class APIClassementService extends APICommon {
    get token(): string {
        return this.userService.token!;
    }

    constructor(private http: HttpClient, private userService: APIUserService, translate: TranslateService) {
        super(translate);
    }

    getClassement(rankingId: string): Promise<Classement> {
        return new Promise<Classement>((resolve, reject) => {
            this.http.get<Message<Classement>>(`${environment.api.path}api/classement/${rankingId}`).subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.error('classement', result));
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

            this.http.get<Message<Classement[]>>(`${environment.api.path}api/classements`, { params }).subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.error('byOptions', result));
                },
            });
        });
    }

    getClassementsByTemplateId(id: string): Promise<Classement[]> {
        return new Promise<Classement[]>((resolve, reject) => {
            this.http.get<Message<Classement[]>>(`${environment.api.path}api/classements/template/${id}`).subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.error('templateId', result));
                },
            });
        });
    }

    getClassementsHome(): Promise<Classement[]> {
        return new Promise<Classement[]>((resolve, reject) => {
            this.http.get<Message<Classement[]>>(`${environment.api.path}api/categories/home`).subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.error('home', result));
                },
            });
        });
    }

    saveClassement(classement: Classement) {
        return new Promise<Classement>((resolve, reject) => {
            this.http
                .post<Message<Classement>>(`${environment.api.path}api/classement`, classement, this.header())
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.error('save', result));
                    },
                });
        });
    }

    deleteClassement(rankingId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http
                .delete<Message<void>>(`${environment.api.path}api/classement/${rankingId}`, this.header())
                .subscribe({
                    next: _ => {
                        resolve();
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.error('delete', result));
                    },
                });
        });
    }

    adminStatusClassement(rankingId: string, status: boolean, type: 'delete' | 'hide'): Promise<Classement[]> {
        return new Promise<Classement[]>((resolve, reject) => {
            this.http
                .post<Message<Classement[]>>(
                    `${environment.api.path}api/admin/classement/status/${rankingId}`,
                    {
                        type,
                        status,
                    },
                    this.header(),
                )
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.error('adminStatusClassement', result));
                    },
                });
        });
    }

    adminGetClassements(page: number = 1): Promise<{ total: number; list: Classement[] }> {
        return new Promise<{ total: number; list: Classement[] }>((resolve, reject) => {
            let params = new HttpParams().set('page', page);

            console.log('params', params);

            this.http
                .get<Message<{ total: number; list: Classement[] }>>(`${environment.api.path}api/admin/classements`, {
                    params,
                    ...this.header(),
                })
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.error('adminGetClassements', result));
                    },
                });
        });
    }
}
