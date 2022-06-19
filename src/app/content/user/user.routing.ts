import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataChange } from 'src/app/services/data-change';

import { UserLoginComponent } from './user-login.component';
import { UserProfileComponent } from './user-profile.component';


const routes: Routes = [
    {
        path: 'login',
        pathMatch: 'full',
        component: UserLoginComponent,
        canActivate: [DataChange],
    },
    {
        path: 'profile',
        pathMatch: 'full',
        component: UserProfileComponent,
        canActivate: [DataChange],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserRoutingModule {}
