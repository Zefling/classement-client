import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Subject } from 'rxjs';

import { Logger, LoggerLevel } from './logger';

interface AniList {
    data: {
        Page: {
            media: AniListMedia[];
        };
    };
}

export interface AniListMedia {
    title: {
        english: string;
        romaji: string;
        native: string;
    };
    coverImage?: {
        extraLarge: string;
    };
    startDate: { year: number };
    disabled?: boolean;
}

@Injectable({ providedIn: 'root' })
export class APIAnilistService {
    private readonly http = inject(HttpClient);
    private readonly logger = inject(Logger);

    readonly baseUrl = 'https://graphql.anilist.co/';
    readonly baseImg = '';

    readonly onChange = new Subject<void>();

    async search(params: { query: string; type: 'ANIME' | 'MANGA'; pageSize: number }) {
        const query = `
query ($page: Int, $perPage: Int, $type: MediaType, $search: String) {
  Page (page: $page, perPage: $perPage) {
    media(search: $search, type: $type) {
      title {
        english
        romaji
        native
      }
      startDate {
        year
      }
      coverImage {
        extraLarge
      }
    }
  }
}
  `;

        return new Promise<AniList>((resolve, reject) => {
            this.http
                .post<AniList>(
                    this.baseUrl,
                    {
                        query: query,
                        variables: {
                            page: 1,
                            perPage: 12,
                            type: params.type || 'ANIME',
                            search: params.query,
                        },
                    },
                    { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } },
                )
                .subscribe({
                    next: response => resolve(response),
                    error: error => {
                        this.logger.log('AniList', LoggerLevel.error, error);
                        reject();
                    },
                });
        });
    }
}
