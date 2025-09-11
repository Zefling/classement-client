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

import { LightDark, Logger, LoggerLevel } from '@ikilote/magma';
import { TranslocoService } from '@jsverse/transloco';

import { Subject, last, map, tap } from 'rxjs';

import { APICommon } from './api.common';
import { APIUserService } from './api.user.service';

import { Message, Theme, ThemeData } from '../interface/interface';

type EventMessage<T> = { event: HttpEvent<Message<T>> | HttpResponse<Message<T>>; message: string };
type ResponseMessage<T> = { event: HttpResponse<Message<T>>; message: string };
type SearchResult = { list: ThemeData[]; total: number };
export type UploadProgress = { percent: number; loaded: number; total: number };

@Injectable({ providedIn: 'root' })
export class APIThemeService extends APICommon {
    protected readonly http = inject(HttpClient);
    protected readonly userService = inject(APIUserService);
    protected readonly lightDark = inject(LightDark);

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

            this.http.get<Message<SearchResult>>(this.apiPath(`themes`), { params }).subscribe({
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
            const req = new HttpRequest('POST', this.apiPath(`theme`), data, {
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

    deleteTheme(id: string) {
        return new Promise<void>((resolve, reject) => {
            this.http
                .delete<Message<void>>(this.apiPath(`theme/${id}`), {
                    ...this.header(),
                })
                .subscribe({
                    next: () => {
                        resolve();
                    },
                    error: (result: HttpErrorResponse) => {
                        this.logger.error('delete', result);
                        reject(result);
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
