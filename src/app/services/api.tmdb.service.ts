import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Logger, LoggerLevel } from '@ikilote/magma';
import { TranslocoService } from '@jsverse/transloco';

import { Subject, firstValueFrom } from 'rxjs';

import { APICommon } from './api.common';
import { APIUserService } from './api.user.service';
import { PreferencesService } from './preferences.service';

import { MovieSearch, PageResult } from '../interface/movie';

type Params =
    | HttpParams
    | {
          [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
      };
type search = {
    headers?:
        | HttpHeaders
        | {
              [header: string]: string | string[];
          };
    params?: Params;
};

@Injectable({ providedIn: 'root' })
export class APITmdbService extends APICommon {
    protected readonly http = inject(HttpClient);
    protected readonly prefs = inject(PreferencesService);
    protected readonly userService = inject(APIUserService);
    protected readonly cd = inject(APIUserService);

    readonly baseUrl = 'https://api.themoviedb.org/3/';
    readonly baseImg = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/';

    private languages?: string[];
    active = false;

    readonly onChange = new Subject<void>();

    key?: string;

    get token(): string {
        return this.userService.token!;
    }

    constructor() {
        const translate = inject(TranslocoService);
        const logger = inject(Logger);

        super(translate, logger);
    }

    protected options(params?: Params, headers?: Record<string, any>): search {
        return {
            ...headers,
            ...(params
                ? {
                      params: Object.fromEntries(
                          Object.entries(params).filter(([_, v]) => v !== null && v !== undefined && v !== ''),
                      ),
                  }
                : {}),
        };
    }

    searchMovies(params: {
        query: string;
        include_adult: boolean;
        language: string;
        page: number;
        primary_release_year?: string;
        year?: string;
        region?: string;
    }) {
        if (this.userService.logged) {
            return new Promise<PageResult<MovieSearch>>((resolve, reject) => {
                this.http
                    .get<
                        PageResult<MovieSearch>
                    >(this.apiPath('tmdb/search/movie'), this.options(params, this.header()))
                    .subscribe({
                        next: response => resolve(response),
                        error: error => {
                            this.logger.log('Movie', LoggerLevel.error, error);
                            reject();
                        },
                    });
            });
        } else {
            return new Promise<PageResult<MovieSearch>>((resolve, reject) => {
                this.http
                    .get<PageResult<MovieSearch>>(
                        `${this.baseUrl}/search/movie`,
                        this.options(params, {
                            headers: new HttpHeaders({
                                accept: 'application/json',
                                Authorization: 'Bearer ' + this.key,
                            }),
                        }),
                    )
                    .subscribe({
                        next: response => resolve(response),
                        error: error => {
                            this.logger.log('Movie', LoggerLevel.error, error);
                            reject();
                        },
                    });
            });
        }
    }

    async acceptedLanguagesLocal() {
        if (this.prefs.preferences.authApiKeys.tmdb.trim() !== this.key) {
            this.key = this.prefs.preferences.authApiKeys.tmdb.trim();

            if (!this.key) {
                this.languages = undefined;
            } else {
                try {
                    this.languages = await firstValueFrom(
                        this.http.get<string[]>(`${this.baseUrl}configuration/primary_translations`, this.options()),
                    );
                } catch (error) {
                    this.logger.log('Movie', LoggerLevel.error, error);
                    this.languages = undefined;
                }
            }
        }
        this.onChange.next();
        this.active = !!this.languages;
        return this.languages;
    }

    async acceptedLanguagesServer() {
        if (this.userService.logged) {
            try {
                this.languages = await firstValueFrom(
                    this.http.get<string[]>(this.apiPath('tmdb/configuration/primary_translations'), this.header()),
                );
            } catch (error) {
                this.logger.log('Movie', LoggerLevel.error, error);
                this.languages = undefined;
            }
        }
        this.onChange.next();
        this.active = !!this.languages;
        return this.languages;
    }
}
