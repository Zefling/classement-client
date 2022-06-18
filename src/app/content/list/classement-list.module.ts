import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/share.module';

import { ClassementListComponent } from './classement-list.component';
import { ClassementListRoutingModule } from './classement-list.routing';


@NgModule({
    declarations: [
        // page
        ClassementListComponent,
    ],
    imports: [SharedModule, ClassementListRoutingModule],
    providers: [],
    exports: [],
})
export class ClassementListModule {}
