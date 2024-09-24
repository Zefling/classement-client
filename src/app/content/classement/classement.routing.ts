import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataChange } from 'src/app/services/data-change';

const routes: Routes = [
    {
        path: ':id/:mode',
        pathMatch: 'full',
        loadComponent: () => import('./classement-edit.component').then(m => m.ClassementEditComponent),
        canActivate: [DataChange],
    },
    {
        path: ':id',
        pathMatch: 'full',
        loadComponent: () => import('./classement-edit.component').then(m => m.ClassementEditComponent),
        canActivate: [DataChange],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClassementRoutingModule {}
