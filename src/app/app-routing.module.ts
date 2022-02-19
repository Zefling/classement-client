import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClassementEditComponent } from './content/classement/classement-edit.component';
import { ClassementHomeComponent } from './content/home/classement-home.component';
import { ClassementListComponent } from './content/list/classement-list.component';


const routes: Routes = [
    {
        path: '',
        component: ClassementHomeComponent,
    },
    {
        path: 'list',
        component: ClassementListComponent,
    },
    {
        path: 'classement/new',
        component: ClassementEditComponent,
    },
    {
        path: 'classement/edit/:id:',
        component: ClassementEditComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
