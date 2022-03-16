import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClassementEditComponent } from './content/classement/classement-edit.component';
import { ClassementHomeComponent } from './content/home/classement-home.component';
import { ClassementListComponent } from './content/list/classement-list.component';
import { DataChange } from './services/data-change';


const routes: Routes = [
    {
        path: '',
        component: ClassementHomeComponent,
        canActivate: [DataChange],
    },
    {
        path: 'list',
        component: ClassementListComponent,
        canActivate: [DataChange],
    },
    {
        path: 'new',
        component: ClassementEditComponent,
        canActivate: [DataChange],
    },
    {
        path: 'edit/:id',
        component: ClassementEditComponent,
        canActivate: [DataChange],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
