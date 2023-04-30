import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { APIRequired } from 'src/app/services/api.required';
import { DataChange } from 'src/app/services/data-change';

import { ClassementNavigateComponent } from './classement-navigate.component';
import { ClassementTemplateComponent } from './classement-template.component';
import { ClassementViewComponent } from './classement-view.component';

const routes: Routes = [
    {
        path: 'template/:id',
        pathMatch: 'full',
        component: ClassementTemplateComponent,
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'view/:id/:history',
        pathMatch: 'full',
        component: ClassementViewComponent,
        canActivate: [DataChange, APIRequired],
    },
    {
        path: 'view/:id',
        pathMatch: 'full',
        component: ClassementViewComponent,
        canActivate: [DataChange, APIRequired],
    },
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
