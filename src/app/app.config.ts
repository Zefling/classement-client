import { HttpClient, provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideTransloco } from '@jsverse/transloco';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';

import { MARKED_OPTIONS, MarkedRenderer, provideMarkdown } from 'ngx-markdown';

import { routes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';

import { environment } from '../environments/environment';

// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory() {
    const renderer = new MarkedRenderer();

    renderer.link = ({ href, title, text }) => {
        const titleAttr = title ? ` title="${title}"` : '';
        return `<a target="_blank" rel="nofollow" href="${href}"${titleAttr}>${text}</a>`;
    };

    return { renderer };
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
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
        provideTranslocoMessageformat({
            biDiSupport: true,
            customFormatters: {
                upcase: value => `${value}`.toUpperCase(),
            },
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
