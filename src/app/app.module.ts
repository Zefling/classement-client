import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClassementEditComponent } from './classement/classement-edit.component';
import { AppHomeComponent } from './home/app-home.component';
import { DirectiveModule } from './directives/directive.module';

@NgModule({
    declarations: [AppComponent, AppHomeComponent, ClassementEditComponent],
    imports: [BrowserModule, AppRoutingModule, DragDropModule, FormsModule, DirectiveModule],
    providers: [],
    exports: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
