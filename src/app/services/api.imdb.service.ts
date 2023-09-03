import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Logger, LoggerLevel } from './logger';
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
export class APIImdbService {
    readonly baseUrl = 'https://api.themoviedb.org/3/';
    readonly baseImg = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/';

    private languages?: string[];

    constructor(
        private readonly http: HttpClient,
        private readonly prefs: PreferencesService,
        private readonly logger: Logger,
    ) {}

    protected options(params?: Params): search {
        return {
            headers: new HttpHeaders({
                accept: 'application/json',
                Authorization: 'Bearer ' + this.prefs.preferences.authApiKeys.imdb,
            }),
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
        return new Promise<PageResult<MovieSearch>>((resolve, reject) => {
            this.http.get<PageResult<MovieSearch>>(`${this.baseUrl}search/movie`, this.options(params)).subscribe({
                next: response => resolve(response),
                error: error => {
                    this.logger.log('Movie', LoggerLevel.error, error);
                    reject();
                },
            });
        });
    }

    acceptedLanguages() {
        return new Promise<string[]>((resolve, reject) => {
            if (!this.languages?.length) {
                this.http.get<string[]>(`${this.baseUrl}configuration/primary_translations`, this.options()).subscribe({
                    next: response => {
                        this.languages = response;
                        resolve(response);
                    },
                    error: error => {
                        this.logger.log('Movie', LoggerLevel.error, error);
                        reject();
                    },
                });
            } else {
                resolve(this.languages);
            }
        });
    }
}
