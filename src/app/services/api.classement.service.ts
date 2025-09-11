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
import { Injectable, inject } from '@angular/core';

import { Logger, LoggerLevel } from '@ikilote/magma';
import { TranslocoService } from '@jsverse/transloco';

import { Subject, last, map, tap } from 'rxjs';

import { APICommon } from './api.common';
import { APIUserService } from './api.user.service';
import { PreferencesService } from './preferences.service';

import {
    Classement,
    ClassementHistory,
    Message,
    MessageError,
    SortClassementCol,
    SortDirection,
} from '../interface/interface';

type EventMessage<T> = { event: HttpEvent<Message<T>> | HttpResponse<Message<T>>; message: string };
type ResponseMessage<T> = { event: HttpResponse<Message<T>>; message: string };
type SearchResult = { list: Classement[]; total: number };
export type UploadProgress = { percent: number; loaded: number; total: number };

@Injectable({ providedIn: 'root' })
export class APIClassementService extends APICommon {
    private readonly http = inject(HttpClient);
    private readonly userService = inject(APIUserService);
    private readonly prefs = inject(PreferencesService);

    progressValue = new Subject<UploadProgress>();

    get token(): string {
        return this.userService.token!;
    }

    constructor() {
        const translate = inject(TranslocoService);
        const logger = inject(Logger);
        super(translate, logger);
    }

    getClassement(rankingId: string, password?: string, history?: number): Promise<Classement> {
        return new Promise<Classement>((resolve, reject) => {
            this.http
                .get<
                    Message<Classement>
                >(this.apiPath(`classement/${rankingId}${history ? `?history=${history}` : ''}`), password ? { headers: new HttpHeaders({ 'X-PASSWORD': password }) } : undefined)
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        // password required
                        if ((result.error as MessageError)?.code === 401) {
                            reject(result.error as MessageError);
                        } else {
                            this.logger.error('classement', result);
                            reject(result);
                        }
                    },
                });
        });
    }

    getClassementsByCriterion(criterion: {
        name?: string;
        category?: string;
        mode?: string;
        page?: number;
        size?: number;
        adult?: boolean;
        tag?: string;
        all?: boolean;
    }): Promise<SearchResult> {
        return new Promise<SearchResult>(async (resolve, reject) => {
            criterion.adult = (await this.prefs.init()).adult;
            let params = new HttpParams();
            for (const i in criterion) {
                if ((criterion as any)[i] !== undefined) {
                    params = params.set(i, (criterion as any)[i]);
                }
            }
            this.logger.log('options', LoggerLevel.log, criterion, 'params', params);

            this.http.get<Message<SearchResult>>(this.apiPath(`classements`), { params }).subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    this.logger.error('byOptions', result);
                    reject(result);
                },
            });
        });
    }

    getClassementsByTemplateId(id: string, userId?: number): Promise<Classement[]> {
        return new Promise<Classement[]>(async (resolve, reject) => {
            const adult = (await this.prefs.init()).adult ? 'true' : 'false';
            const url = this.apiPath(`classements/template/${id}?adult=${adult}${userId ? `&userId=${userId}` : ''}`);
            this.http.get<Message<Classement[]>>(url).subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    this.logger.error('templateId', result);
                    reject(result);
                },
            });
        });
    }

    getClassementsHistory(id: string): Promise<ClassementHistory[]> {
        return new Promise<ClassementHistory[]>((resolve, reject) => {
            this.http.get<Message<ClassementHistory[]>>(this.apiPath(`classement/history/${id}`)).subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    this.logger.error('templateId', result);
                    reject(result);
                },
            });
        });
    }

    getClassementsLast(limit: number = 11): Promise<Classement[]> {
        return new Promise<Classement[]>(async (resolve, reject) => {
            const adult = (await this.prefs.init()).adult ? 'true' : 'false';
            this.http
                .get<Message<Classement[]>>(this.apiPath(`classements/last?adult=${adult}&limit=${limit}`))
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        this.logger.error('last', result);
                        reject(result);
                    },
                });
        });
    }

    getClassementsHome(): Promise<Classement[]> {
        return new Promise<Classement[]>(async (resolve, reject) => {
            const adult = (await this.prefs.init()).adult ? 'true' : 'false';
            this.http.get<Message<Classement[]>>(this.apiPath(`categories/home?adult=${adult}`)).subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    this.logger.error('home', result);
                    reject(result);
                },
            });
        });
    }

    saveClassement(classement: Classement) {
        return new Promise<Classement>((resolve, reject) => {
            const req = new HttpRequest('POST', this.apiPath(`classement`), classement, {
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
                            reject(this.logger.error('save', { error: 0 } as HttpErrorResponse));
                        }
                    },
                    error: (result: HttpErrorResponse) => {
                        this.logger.error('save', result);
                        reject(result);
                    },
                });
        });
    }

    testLink(linkId: string, rankingId?: string) {
        return new Promise<boolean>((resolve, reject) => {
            this.http
                .post<boolean>(this.apiPath(`testId`), {
                    linkId,
                    rankingId,
                })
                .subscribe({
                    next: result => {
                        resolve(result);
                    },
                    error: (result: HttpErrorResponse) => {
                        this.logger.error('home', result);
                        reject(result);
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
        type: 'delete' | 'hide' | 'category' | 'adult',
        admin = false,
    ): Promise<Classement[]> {
        return new Promise<Classement[]>((resolve, reject) => {
            this.http
                .post<Message<Classement[]>>(
                    this.apiPath(`${admin ? 'admin/' : ''}classement/status/${rankingId}`),
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
                        this.logger.error('adminStatusClassement', result);
                        reject(result);
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
                .get<Message<{ total: number; list: Classement[] }>>(this.apiPath(`admin/classements`), {
                    params,
                    ...this.header(),
                })
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        this.logger.error('adminGetClassements', result);
                        reject(result);
                    },
                });
        });
    }
}
