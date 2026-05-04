import { Routes } from '@angular/router';

import { DataChange } from 'src/app/services/data-change';

export const LIST_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./classement-list.component').then(m => m.ClassementListComponent),
        canActivate: [DataChange],
    },
];
