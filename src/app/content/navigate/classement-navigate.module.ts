import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/share.module';

import { ClassementNavigateComponent } from './classement-navigate.component';
import { ClassementNavigatetRoutingModule } from './classement-navigate.routing';


@NgModule({
    declarations: [
        // page
        ClassementNavigateComponent,
    ],
    imports: [SharedModule, ClassementNavigatetRoutingModule],
    providers: [],
    exports: [],
})
export class ClassementNavigateModule {}
