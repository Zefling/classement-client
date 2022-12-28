import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataChange } from 'src/app/services/data-change';

import { LicensesComponent } from './licenses.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: LicensesComponent,
        canActivate: [DataChange],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LicensesRoutingModule {}
