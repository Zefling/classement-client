import { Routes } from '@angular/router';

import { DataChange } from '../../services/data-change';

export const HOME_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./classement-home.component').then(m => m.ClassementHomeComponent),
        canActivate: [DataChange],
    },
];
