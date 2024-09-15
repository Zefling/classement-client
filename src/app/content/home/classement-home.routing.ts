import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataChange } from 'src/app/services/data-change';



const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./classement-home.component').then(m => m.ClassementHomeComponent),
        canActivate: [DataChange],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClassementHomeRoutingModule {}
