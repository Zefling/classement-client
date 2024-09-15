import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/share.module';

import { ClassementListComponent } from './classement-list.component';
import { ClassementListRoutingModule } from './classement-list.routing';

@NgModule({
    imports: [
        SharedModule,
        ClassementListRoutingModule,
        // page
        ClassementListComponent,
    ],
    providers: [],
    exports: [ClassementListComponent],
})
export class ClassementListModule {}
