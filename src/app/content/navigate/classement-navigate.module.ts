import { NgModule } from '@angular/core';

import { MarkdownModule, MarkdownService } from 'ngx-markdown';

import { SharedModule } from 'src/app/share.module';

import { ClassementNavigateComponent } from './classement-navigate.component';
import { ClassementNavigatetRoutingModule } from './classement-navigate.routing';
import { ClassementTemplateComponent } from './classement-template.component';
import { ClassementViewComponent } from './classement-view.component';

@NgModule({
    declarations: [
        // page
        ClassementNavigateComponent,
        ClassementTemplateComponent,
        ClassementViewComponent,
    ],
    imports: [SharedModule, ClassementNavigatetRoutingModule, MarkdownModule],
    providers: [MarkdownService],
    exports: [],
})
export class ClassementNavigateModule {}
