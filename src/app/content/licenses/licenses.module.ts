import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/share.module';

import { LicensesComponent } from './licenses.component';
import { LicensesRoutingModule } from './licenses.routing';


@NgModule({
    declarations: [
        // page
        LicensesComponent,
    ],
    imports: [SharedModule, LicensesRoutingModule],
    providers: [],
    exports: [],
})
export class LicensesModule {}
