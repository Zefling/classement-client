import { NgModule } from '@angular/core';

import { MarkdownModule, MarkdownService } from 'ngx-markdown';

import { SharedModule } from 'src/app/share.module';

import { ClassementNavigateComponent } from './classement-navigate.component';
import { ClassementNavigateRoutingModule } from './classement-navigate.routing';
import { ClassementTemplateComponent } from './classement-template.component';
import { ClassementViewComponent } from './classement-view.component';

@NgModule({
    imports: [
        SharedModule,
        ClassementNavigateRoutingModule,
        MarkdownModule,
        // page
        ClassementNavigateComponent,
        ClassementTemplateComponent,
        ClassementViewComponent,
    ],
    providers: [MarkdownService],
    exports: [],
})
export class ClassementNavigateModule {}
