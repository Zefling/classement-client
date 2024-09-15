import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/share.module';

import { ClassementHomeComponent } from './classement-home.component';
import { ClassementHomeRoutingModule } from './classement-home.routing';

@NgModule({
    imports: [
        SharedModule,
        ClassementHomeRoutingModule,
        // page
        ClassementHomeComponent,
    ],
    providers: [],
    exports: [],
})
export class ClassementHomeModule {}
