import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment } from 'src/environments/environment';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./content/home/classement-home.module').then(m => m.ClassementHomeModule),
    },
    {
        path: 'list',
        loadChildren: () => import('./content/list/classement-list.module').then(m => m.ClassementListModule),
    },
    {
        path: 'licenses',
        loadChildren: () => import('./content/licenses/licenses.module').then(m => m.LicensesModule),
    },
    {
        path: 'edit',
        loadChildren: () => import('./content/classement/classement.module').then(m => m.ClassementModule),
    },
    {
        path: 'user',
        loadChildren: () => import('./content/user/user.module').then(m => m.UserModule),
    },
    {
        path: 'navigate',
        loadChildren: () =>
            import('./content/navigate/classement-navigate.module').then(m => m.ClassementNavigateModule),
    },
    {
        path: 'admin',
        loadChildren: () => import('./content/admin/admin.module').then(m => m.AdminModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: environment.debugRouter })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
