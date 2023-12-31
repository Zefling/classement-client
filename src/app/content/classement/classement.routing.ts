import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataChange } from 'src/app/services/data-change';

import { ClassementEditComponent } from './classement-edit.component';

const routes: Routes = [
    {
        path: ':id/:mode',
        pathMatch: 'full',
        component: ClassementEditComponent,
        canActivate: [DataChange],
    },
    {
        path: ':id',
        pathMatch: 'full',
        component: ClassementEditComponent,
        canActivate: [DataChange],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClassementRoutingModule {}
