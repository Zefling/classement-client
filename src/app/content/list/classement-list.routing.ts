import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataChange } from 'src/app/services/data-change';

import { ClassementListComponent } from './classement-list.component';


const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ClassementListComponent,
        canActivate: [DataChange],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClassementListRoutingModule {}
