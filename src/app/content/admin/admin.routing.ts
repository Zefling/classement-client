import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { APIModeration } from 'src/app/services/api.moderation';
import { APIRequired } from 'src/app/services/api.required';
import { DataChange } from 'src/app/services/data-change';

const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./admin.component').then(m => m.AdminComponent),
        canActivate: [DataChange, APIRequired, APIModeration],
        children: [
            {
                path: 'users',
                pathMatch: 'full',
                loadComponent: () => import('./admin-users.component').then(m => m.AdminUsersComponent),
            },
            {
                path: 'classements',
                pathMatch: 'full',
                loadComponent: () => import('./admin-classements.component').then(m => m.AdminClassementsComponent),
            },
            {
                path: 'stats',
                pathMatch: 'full',
                loadComponent: () => import('./admin-stats.component').then(m => m.AdminStatsComponent),
            },
            {
                path: '**',
                redirectTo: 'users',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
