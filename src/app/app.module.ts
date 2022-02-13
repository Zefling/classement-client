import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClassementEditComponent } from './content/classement/classement-edit.component';
import { ClassementHomeComponent } from './content/home/classement-home.component';
import { DirectiveModule } from './directives/directive.module';
import { ClassementListComponent } from './content/list/classement-list.component';

@NgModule({
    declarations: [AppComponent, ClassementHomeComponent, ClassementEditComponent, ClassementListComponent],
    imports: [BrowserModule, AppRoutingModule, DragDropModule, FormsModule, DirectiveModule],
    providers: [],
    exports: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
