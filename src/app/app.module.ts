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
import {
  ClassementEditComponent,
} from './content/classement/classement-edit.component';
import {
  ClassementOptimiseComponent,
} from './content/classement/classement-optimise.component';
import {
  ClassementOptionsComponent,
} from './content/classement/classement-options.component';
import {
  ClassemenThemesComponent,
} from './content/classement/classement-themes.component';
import {
  ClassementHomeComponent,
} from './content/home/classement-home.component';
import { LicensesComponent } from './content/licenses/licenses.component';
import {
  ClassementListComponent,
} from './content/list/classement-list.component';
import { DirectiveModule } from './directives/directive.module';
import { PipesModule } from './pipes/pipes.module';


export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,

        // page
        ClassementHomeComponent,
        ClassementOptionsComponent,
        ClassemenThemesComponent,
        ClassementEditComponent,
        ClassementListComponent,
        ClassementOptimiseComponent,
        LicensesComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        DragDropModule,
        FormsModule,
        DirectiveModule,
        ComponentsModule,
        PipesModule,
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
