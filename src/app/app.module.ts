import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { ClassementEditComponent } from './content/classement/classement-edit.component';
import { ClassementOptionsComponent } from './content/classement/classement-options.component';
import { ClassementHomeComponent } from './content/home/classement-home.component';
import { ClassementListComponent } from './content/list/classement-list.component';
import { DirectiveModule } from './directives/directive.module';


export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,

        // page
        ClassementHomeComponent,
        ClassementOptionsComponent,
        ClassementEditComponent,
        ClassementListComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        DragDropModule,
        FormsModule,
        DirectiveModule,
        ComponentsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            defaultLanguage: 'en',
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
    ],
    providers: [],
    exports: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
