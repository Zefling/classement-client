import {
    HttpClient,
    HttpErrorResponse,
    HttpEvent,
    HttpEventType,
    HttpHeaders,
    HttpParams,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Subject, last, map, tap } from 'rxjs';

import { environment } from 'src/environments/environment';

import { APICommon } from './api.common';
import { APIUserService } from './api.user.service';
import { Logger, LoggerLevel } from './logger';

import { Message, MessageError } from '../content/user/user.interface';
import { Classement, ClassementHistory, SortClassementCol, SortDirection } from '../interface';

type EventMessage<T> = { event: HttpEvent<Message<T>> | HttpResponse<Message<T>>; message: string };
type ResponseMessage<T> = { event: HttpResponse<Message<T>>; message: string };
type SearchResult = { list: Classement[]; total: number };
export type UploadProgress = { percent: number; loaded: number; total: number };

@Injectable({ providedIn: 'root' })
export class APIClassementService extends APICommon {
    progressValue = new Subject<UploadProgress>();

    get token(): string {
        return this.userService.token!;
    }

    constructor(
        private readonly http: HttpClient,
        private readonly userService: APIUserService,
        translate: TranslateService,
        logger: Logger,
    ) {
        super(translate, logger);
    }

    getClassement(rankingId: string, password?: string, history?: number): Promise<Classement> {
        return new Promise<Classement>((resolve, reject) => {
            this.http
                .get<Message<Classement>>(
                    `${environment.api.path}api/classement/${rankingId}${history ? `?history=${history}` : ''}`,
                    password ? { headers: new HttpHeaders({ 'X-PASSWORD': password }) } : undefined,
                )
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        // password required
                        if ((result.error as MessageError)?.code === 401) {
                            reject(result.error as MessageError);
                        } else {
                            reject(this.error('classement', result));
                        }
                    },
                });
        });
    }

    getClassementsByCriterion(criterion: {
        name?: string;
        category?: string;
        page?: number;
        size?: number;
    }): Promise<SearchResult> {
        return new Promise<SearchResult>((resolve, reject) => {
            let params = new HttpParams();
            for (const i in criterion) {
                if ((criterion as any)[i] !== undefined) {
                    params = params.set(i, (criterion as any)[i]);
                }
            }
            this.logger.log('options', LoggerLevel.log, criterion, 'params', params);

            this.http.get<Message<SearchResult>>(`${environment.api.path}api/classements`, { params }).subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.error('byOptions', result));
                },
            });
        });
    }

    getClassementsByTemplateId(id: string, userId?: number): Promise<Classement[]> {
        return new Promise<Classement[]>((resolve, reject) => {
            this.http
                .get<Message<Classement[]>>(
                    `${environment.api.path}api/classements/template/${id}${userId ? `?userId=${userId}` : ''}`,
                )
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.error('templateId', result));
                    },
                });
        });
    }

    getClassementsHistory(id: string): Promise<ClassementHistory[]> {
        return new Promise<ClassementHistory[]>((resolve, reject) => {
            this.http
                .get<Message<ClassementHistory[]>>(`${environment.api.path}api/classement/history/${id}`)
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.error('templateId', result));
                    },
                });
        });
    }

    getClassementsLast(limit: number = 8): Promise<Classement[]> {
        return new Promise<Classement[]>((resolve, reject) => {
            this.http
                .get<Message<Classement[]>>(`${environment.api.path}api/classements/last?limit=${limit}`)
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.error('last', result));
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
            const req = new HttpRequest('POST', `${environment.api.path}api/classement`, classement, {
                ...this.header(),
                reportProgress: true,
                responseType: 'json',
            });
            return this.http
                .request<Message<Classement>>(req)
                .pipe<EventMessage<Classement>, EventMessage<Classement>, ResponseMessage<Classement>>(
                    map(event => this.getEventMessage(event, classement)),
                    tap(message => this.showProgress(message)),
                    last<any>(), // return last (completed) message to caller
                )
                .subscribe({
                    next: result => {
                        if (result.event.body) {
                            resolve(result.event.body.message);
                        } else {
                            reject(this.error('save', { error: 0 } as HttpErrorResponse));
                        }
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.error('save', result));
                    },
                });
        });
    }

    private getEventMessage(
        event: HttpEvent<Message<Classement>> | HttpResponse<Message<Classement>>,
        classement: Classement,
    ): EventMessage<Classement> {
        switch (event.type) {
            case HttpEventType.Sent:
                return { event, message: `Uploading classement “${classement.name}”.` };

            case HttpEventType.UploadProgress:
                const percentDone = event.total ? Math.round((100 * event.loaded) / event.total) : 0;
                this.progressValue.next({ percent: percentDone, loaded: event.loaded, total: event.total || 0 });
                return { event, message: `Classement “${classement.name}” is ${percentDone}% uploaded.` };

            case HttpEventType.Response:
                return { event, message: `Classement “${classement.name}” was completely uploaded!` };

            default:
                return { event, message: `Classement “${classement.name}” surprising upload event: ${event.type}.` };
        }
    }

    private showProgress(message: EventMessage<Classement>): void {
        this.logger.log('showProgress', LoggerLevel.log, message);
    }

    statusClassement(
        rankingId: string,
        status: boolean | string,
        type: 'delete' | 'hide' | 'category',
        admin = false,
    ): Promise<Classement[]> {
        return new Promise<Classement[]>((resolve, reject) => {
            this.http
                .post<Message<Classement[]>>(
                    `${environment.api.path}api/${admin ? 'admin/' : ''}classement/status/${rankingId}`,
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

    adminGetClassements(
        page: number = 1,
        sort: SortClassementCol,
        direction: SortDirection,
        name?: string,
        category?: string,
    ): Promise<{ total: number; list: Classement[] }> {
        return new Promise<{ total: number; list: Classement[] }>((resolve, reject) => {
            let params = new HttpParams().set('page', page).set('order', sort).set('direction', direction);
            if (name) {
                params = params.set('name', name);
            }
            if (category) {
                params = params.set('category', category);
            }
            this.logger.log('params', LoggerLevel.log, params);

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
