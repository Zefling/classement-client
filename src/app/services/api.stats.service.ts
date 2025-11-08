import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Logger } from '@ikilote/magma';
import { TranslocoService } from '@jsverse/transloco';

import { APICommon } from './api.common';
import { APIUserService } from './api.user.service';

import { Message, PeriodStatsResult, StatsResult, TargetStatsResult } from '../interface/interface';

@Injectable({ providedIn: 'root' })
export class APIStatsService extends APICommon {
    private readonly http = inject(HttpClient);
    private readonly userService = inject(APIUserService);

    get token(): string {
        return this.userService.token!;
    }

    constructor() {
        const translate = inject(TranslocoService);
        const logger = inject(Logger);
        super(translate, logger);
    }

    getStats<T>(criterion?: { target?: TargetStatsResult; period?: PeriodStatsResult }): Promise<StatsResult<T>> {
        return new Promise<StatsResult<T>>((resolve, reject) => {
            let params = new HttpParams();
            for (const i in criterion) {
                if ((criterion as any)[i] !== undefined) {
                    params = params.set(i, (criterion as any)[i]);
                }
            }

            this.http
                .get<Message<StatsResult<T>>>(this.apiPath(`admin/stats`), {
                    params,
                    ...this.header(),
                    responseType: 'json',
                })
                .subscribe({
                    next: result => {
                        resolve(result.message);
                    },
                    error: (result: HttpErrorResponse) => {
                        reject(this.error('stats', result));
                    },
                });
        });
    }
}
