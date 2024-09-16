import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { APIRequired } from 'src/app/services/api.required';
import { DataChange } from 'src/app/services/data-change';

const routes: Routes = [
    {
        path: 'login',
        pathMatch: 'full',
        loadComponent: () => import('./user-login.component').then(m => m.UserLoginComponent),
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'connect/:service/:token',
        pathMatch: 'full',
        loadComponent: () => import('./user-login-oauth.component').then(m => m.UserLoginOauthComponent),
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'profile',
        pathMatch: 'full',
        loadComponent: () => import('./user-profile.component').then(m => m.UserProfileComponent),
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'sign-up',
        pathMatch: 'full',
        loadComponent: () => import('./user-signup.component').then(m => m.UserSignupComponent),
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'validate/:token',
        pathMatch: 'full',
        loadComponent: () => import('./user-signup-validate.component').then(m => m.UserSignupValidateComponent),
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'password-lost',
        pathMatch: 'full',
        loadComponent: () => import('./user-pw-lost.component').then(m => m.UserPwLostComponent),
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'password-lost/:token',
        pathMatch: 'full',
        loadComponent: () => import('./user-pw-lost-change.component').then(m => m.UserPwLostChangeComponent),
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'information',
        pathMatch: 'full',
        loadComponent: () => import('./user-information.component').then(m => m.UserInformationComponent),
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'lists',
        pathMatch: 'full',
        loadComponent: () => import('./user-list.component').then(m => m.UserListComponent),
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'lists/:page',
        pathMatch: 'full',
        loadComponent: () => import('./user-list.component').then(m => m.UserListComponent),
        canActivate: [DataChange, APIRequired],
    },
    {
        path: ':id',
        pathMatch: 'full',
        loadComponent: () => import('./user-view.component').then(m => m.UserViewComponent),
        canActivate: [DataChange, APIRequired],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserRoutingModule {}
