import {
    HttpClient,
    HttpErrorResponse,
    HttpEvent,
    HttpEventType,
    HttpParams,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

import { Subject, last, map, tap } from 'rxjs';

import { environment } from 'src/environments/environment';

import { APICommon } from './api.common';
import { APIUserService } from './api.user.service';
import { Logger, LoggerLevel } from './logger';

import { Message } from '../content/user/user.interface';
import { Theme, ThemeData } from '../interface/interface';

type EventMessage<T> = { event: HttpEvent<Message<T>> | HttpResponse<Message<T>>; message: string };
type ResponseMessage<T> = { event: HttpResponse<Message<T>>; message: string };
type SearchResult = { list: ThemeData[]; total: number };
export type UploadProgress = { percent: number; loaded: number; total: number };

@Injectable({ providedIn: 'root' })
export class APIThemeService extends APICommon {
    private readonly http = inject(HttpClient);
    private readonly userService = inject(APIUserService);

    progressValue = new Subject<UploadProgress>();

    get token(): string {
        return this.userService.token!;
    }

    constructor() {
        const translate = inject(TranslocoService);
        const logger = inject(Logger);

        super(translate, logger);
    }

    getThemesByCriterion(criterion: {
        name?: string;
        mode?: string;
        page?: number;
        user?: number;
        size?: number;
    }): Promise<SearchResult> {
        return new Promise<SearchResult>((resolve, reject) => {
            let params = new HttpParams();
            for (const i in criterion) {
                if ((criterion as any)[i] !== undefined) {
                    params = params.set(i, (criterion as any)[i]);
                }
            }

            this.http.get<Message<SearchResult>>(`${environment.api.path}api/themes`, { params }).subscribe({
                next: result => {
                    resolve(result.message);
                },
                error: (result: HttpErrorResponse) => {
                    reject(this.error('byOptions', result));
                },
            });
        });
    }

    saveTheme(theme: Theme<string>, id?: string): Promise<ThemeData> {
        const data = {
            themeId: id,
            name: theme.name,
            mode: theme.options.mode,
            hidden: theme.hidden,
            data: {
                options: theme.options,
            },
        } as ThemeData;

        return new Promise<ThemeData>((resolve, reject) => {
            const req = new HttpRequest('POST', `${environment.api.path}api/theme`, data, {
                ...this.header(),
                reportProgress: true,
                responseType: 'json',
            });
            return this.http
                .request<Message<ThemeData>>(req)
                .pipe<EventMessage<ThemeData>, EventMessage<ThemeData>, ResponseMessage<ThemeData>>(
                    map(event => this.getEventMessage(event, data)),
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

    deleteTheme(id: string) {
        return new Promise<void>((resolve, reject) => {
            this.http
                .delete<Message<void>>(`${environment.api.path}api/theme/${id}`, {
                    ...this.header(),
                })
                .subscribe({
                    next: () => {
                        resolve();
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.error('delete', result));
                    },
                });
        });
    }

    private getEventMessage(
        event: HttpEvent<Message<ThemeData>> | HttpResponse<Message<ThemeData>>,
        classement: ThemeData,
    ): EventMessage<ThemeData> {
        switch (event.type) {
            case HttpEventType.Sent:
                return { event, message: `Uploading theme “${classement.name}”.` };

            case HttpEventType.UploadProgress:
                const percentDone = event.total ? Math.round((100 * event.loaded) / event.total) : 0;
                this.progressValue.next({ percent: percentDone, loaded: event.loaded, total: event.total || 0 });
                return { event, message: `Theme “${classement.name}” is ${percentDone}% uploaded.` };

            case HttpEventType.Response:
                return { event, message: `Theme “${classement.name}” was completely uploaded!` };

            default:
                return { event, message: `Theme “${classement.name}” surprising upload event: ${event.type}.` };
        }
    }

    private showProgress(message: EventMessage<ThemeData>): void {
        this.logger.log('showProgress', LoggerLevel.log, message);
    }
}
