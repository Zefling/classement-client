import { CommonModule } from '@angular/common';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { TranslocoModule } from '@jsverse/transloco';

import { MARKED_OPTIONS, MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { InfoMessagesComponent } from './components/info-messages/info-messages.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PreferencesDialogComponent } from './components/preferences/preferences.component';
import { TranslocoRootModule } from './transloco-root.module';

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
        CommonModule,
        FormsModule,
        AppRoutingModule,
        BrowserModule,
        MarkdownModule.forRoot({
            loader: HttpClient,
            markedOptions: {
                provide: MARKED_OPTIONS,
                useFactory: markedOptionsFactory,
            },
        }),
        TranslocoModule,
        TranslocoRootModule,

        //internal
        LoaderComponent,
        DialogComponent,
        PreferencesDialogComponent,
        InfoMessagesComponent,
    ],
    providers: [provideHttpClient(withInterceptorsFromDi())],
    bootstrap: [AppComponent],
})
export class AppModule {}
