import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DialogComponent } from './dialog.component';


@NgModule({
    declarations: [DialogComponent],
    exports: [DialogComponent],
    imports: [BrowserModule],
})
export class ComponentsModule {}
