import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Logger, LoggerLevel } from './logger';
import { PreferencesService } from './preferences.service';

import { firstValueFrom, Subject } from 'rxjs';
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
    private readonly http = inject(HttpClient);
    private readonly prefs = inject(PreferencesService);
    private readonly logger = inject(Logger);

    readonly baseUrl = 'https://api.themoviedb.org/3/';
    readonly baseImg = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/';

    private languages?: string[];

    readonly onChange = new Subject<void>();

    key?: string;

    isActive() {
        return (this.languages?.length ?? 0) > 0;
    }

    protected options(params?: Params): search {
        return {
            headers: new HttpHeaders({
                accept: 'application/json',
                Authorization: 'Bearer ' + this.key,
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

    async acceptedLanguages() {
        if (this.prefs.preferences.authApiKeys.imdb.trim() !== this.key) {
            this.key = this.prefs.preferences.authApiKeys.imdb.trim();

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
        return this.languages;
    }
}
