import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideTransloco } from '@jsverse/transloco';

import { MARKED_OPTIONS, MarkedRenderer, provideMarkdown } from 'ngx-markdown';

import { routes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';

import { environment } from '../environments/environment';

// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory() {
    const renderer = new MarkedRenderer();

    renderer.link = ({ href, text }) => {
        return `<a target="_blank" rel="nofollow" href="${href}">${text}</a>`;
    };

    return { renderer };
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideHttpClient(withInterceptorsFromDi()),
        provideTransloco({
            config: {
                availableLangs: ['en', 'fr', 'ja', 'ar'],
                defaultLang: 'en',
                // Remove this option if your application doesn't support changing language in runtime.
                reRenderOnLangChange: true,
                prodMode: environment.production,
            },
            loader: TranslocoHttpLoader,
        }),
        provideMarkdown({
            loader: HttpClient,
            markedOptions: {
                provide: MARKED_OPTIONS,
                useFactory: markedOptionsFactory,
            },
        }),
    ],
};
