import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/share.module';

import { ClassementNavigateResultComponent } from './classement-navigate-result.component';
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
        ClassementNavigateResultComponent,
    ],
    imports: [SharedModule, ClassementNavigatetRoutingModule],
    providers: [],
    exports: [],
})
export class ClassementNavigateModule {}
