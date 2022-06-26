import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { APIRequired } from 'src/app/services/api-required';
import { DataChange } from 'src/app/services/data-change';

import { UserLoginComponent } from './user-login.component';
import { UserProfileComponent } from './user-profile.component';


const routes: Routes = [
    {
        path: 'login',
        pathMatch: 'full',
        component: UserLoginComponent,
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'profile',
        pathMatch: 'full',
        component: UserProfileComponent,
        canActivate: [DataChange, APIRequired],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserRoutingModule {}
