import { Routes } from '@angular/router';

import { DataChange } from '../../services/data-change';

export const INFOS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./infos.component').then(m => m.InfosComponent),
        canActivate: [DataChange],
        children: [
            {
                path: 'message',
                pathMatch: 'full',
                loadComponent: () => import('./infos-message.component').then(m => m.InfosMessageComponent),
            },
            {
                path: 'licenses',
                pathMatch: 'full',
                loadComponent: () => import('./infos-licenses.component').then(m => m.InfosLicensesComponent),
            },
            {
                path: 'changelog',
                pathMatch: 'full',
                loadComponent: () => import('./infos-changelog.component').then(m => m.InfoChangelogComponent),
            },
            {
                path: 'contributors',
                pathMatch: 'full',
                loadComponent: () => import('./infos-contributors.component').then(m => m.InfoContributorsComponent),
            },
            {
                path: '**',
                redirectTo: 'message',
            },
        ],
    },
];
