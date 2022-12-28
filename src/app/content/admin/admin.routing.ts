import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { APIModeration } from 'src/app/services/api.moderation';
import { APIRequired } from 'src/app/services/api.required';
import { DataChange } from 'src/app/services/data-change';

import { AdminClassementsComponent } from './admin-classements.component';
import { AdminUsersComponent } from './admin-users.component';
import { AdminComponent } from './admin.component';

const routes: Routes = [
    {
        path: '',

        component: AdminComponent,
        canActivate: [DataChange, APIRequired, APIModeration],
        children: [
            {
                path: 'users',
                pathMatch: 'full',
                component: AdminUsersComponent,
            },
            {
                path: 'classements',
                pathMatch: 'full',
                component: AdminClassementsComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
