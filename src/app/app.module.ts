import { HttpClient, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { TranslocoModule } from '@jsverse/transloco';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MARKED_OPTIONS, MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './share.module';
import { TranslocoRootModule } from './transloco-root.module';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(): MarkedOptions {
    const renderer = new MarkedRenderer();

    const linkRenderer = renderer.link;
    renderer.link = (href, title, text) => {
        const html = linkRenderer.call(renderer, href, title, text);
        return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
    };

    return {
        renderer: renderer,
        gfm: true,
        breaks: false,
        pedantic: false,
    };
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        AppRoutingModule,
        BrowserModule,
        SharedModule,
        MarkdownModule.forRoot({
            loader: HttpClient,
            markedOptions: {
                provide: MARKED_OPTIONS,
                useFactory: markedOptionsFactory,
            },
        }),
        TranslocoModule,
        HttpClientModule,
        TranslocoRootModule,
    ],
    providers: [provideHttpClient(withInterceptorsFromDi())],
    exports: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
