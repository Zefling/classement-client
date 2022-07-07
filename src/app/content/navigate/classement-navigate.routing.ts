import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { APIRequired } from 'src/app/services/api.required';
import { DataChange } from 'src/app/services/data-change';

import { ClassementNavigateComponent } from './classement-navigate.component';


const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ClassementNavigateComponent,
        canActivate: [DataChange, APIRequired],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClassementNavigatetRoutingModule {}
