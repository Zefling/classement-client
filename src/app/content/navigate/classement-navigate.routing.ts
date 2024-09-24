import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { APIRequired } from 'src/app/services/api.required';
import { DataChange } from 'src/app/services/data-change';

const routes: Routes = [
    {
        path: 'template/:id',
        pathMatch: 'full',
        loadComponent: () => import('./classement-template.component').then(m => m.ClassementTemplateComponent),
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'view/:id/:history',
        pathMatch: 'full',
        loadComponent: () => import('./classement-view.component').then(m => m.ClassementViewComponent),
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'view/:id',
        pathMatch: 'full',
        loadComponent: () => import('./classement-view.component').then(m => m.ClassementViewComponent),
        canActivate: [DataChange, APIRequired],
    },
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./classement-navigate.component').then(m => m.ClassementNavigateComponent),
        canActivate: [DataChange, APIRequired],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClassementNavigateRoutingModule {}
