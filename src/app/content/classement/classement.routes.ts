import { Routes } from '@angular/router';

import { DataChange } from 'src/app/services/data-change';

export const CLASSEMENT_ROUTES: Routes = [
    {
        path: ':id/:mode/:options',
        pathMatch: 'full',
        loadComponent: () => import('./classement-edit.component').then(m => m.ClassementEditComponent),
        canActivate: [DataChange],
    },
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
