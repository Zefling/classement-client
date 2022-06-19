import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


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
        path: 'licences',
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
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
