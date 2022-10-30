import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { APIRequired } from 'src/app/services/api.required';
import { DataChange } from 'src/app/services/data-change';

import { UserInformationComponent } from './user-information.component';
import { UserListComponent } from './user-list.component';
import { UserLoginAouthComponent } from './user-login-oauth.component';
import { UserLoginComponent } from './user-login.component';
import { UserProfileComponent } from './user-profile.component';
import { UserPwLostChangeComponent } from './user-pw-lost-change.component';
import { UserPwLostComponent } from './user-pw-lost.component';
import { UserSignupValidateComponent } from './user-signup-validate.component';
import { UserSignupComponent } from './user-signup.component';


const routes: Routes = [
    {
        path: 'login',
        pathMatch: 'full',
        component: UserLoginComponent,
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'connect/:service/:token',
        pathMatch: 'full',
        component: UserLoginAouthComponent,
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'profile',
        pathMatch: 'full',
        component: UserProfileComponent,
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'sign-up',
        pathMatch: 'full',
        component: UserSignupComponent,
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'validate/:token',
        pathMatch: 'full',
        component: UserSignupValidateComponent,
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'password-lost',
        pathMatch: 'full',
        component: UserPwLostComponent,
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'password-lost/:token',
        pathMatch: 'full',
        component: UserPwLostChangeComponent,
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'information',
        pathMatch: 'full',
        component: UserInformationComponent,
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'lists',
        pathMatch: 'full',
        component: UserListComponent,
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'lists/:page',
        pathMatch: 'full',
        component: UserListComponent,
        canActivate: [DataChange, APIRequired],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserRoutingModule {}
