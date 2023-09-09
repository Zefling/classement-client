import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Logger, LoggerLevel } from './logger';
import { PreferencesService } from './preferences.service';

import { AnimeSearch } from '../interface/anime';

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
export class APIMalService {
    readonly baseUrl = 'https://api.myanimelist.net/v2/';

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
                Authorization: 'Bearer ' + this.prefs.preferences.authApiKeys.mal,
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

    searchAnime(params: { q: string; limit: number; offset?: number }) {
        return new Promise<AnimeSearch>((resolve, reject) => {
            this.http.get<AnimeSearch>(`${this.baseUrl}anime`, this.options(params)).subscribe({
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
