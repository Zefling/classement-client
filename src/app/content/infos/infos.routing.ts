import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataChange } from 'src/app/services/data-change';

const routes: Routes = [
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
                path: '**',
                redirectTo: 'message',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InfosRoutingModule {}
