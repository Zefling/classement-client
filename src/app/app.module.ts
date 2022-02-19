import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { ClassementEditComponent } from './content/classement/classement-edit.component';
import { ClassementHomeComponent } from './content/home/classement-home.component';
import { ClassementListComponent } from './content/list/classement-list.component';
import { DirectiveModule } from './directives/directive.module';


@NgModule({
    declarations: [
        AppComponent,

        // page
        ClassementHomeComponent,
        ClassementEditComponent,
        ClassementListComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, DragDropModule, FormsModule, DirectiveModule, ComponentsModule],
    providers: [],
    exports: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
