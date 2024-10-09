import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment';

import { APICommon } from './api.common';
import { APIUserService } from './api.user.service';
import { Logger, LoggerLevel } from './logger';

import { Message } from '../content/user/user.interface';
import { ThemeData } from '../interface/interface';

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
            this.logger.log('options', LoggerLevel.log, criterion, 'params', params);

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
}
