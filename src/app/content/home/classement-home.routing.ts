import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataChange } from 'src/app/services/data-change';

import { ClassementHomeComponent } from './classement-home.component';


const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ClassementHomeComponent,
        canActivate: [DataChange],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClassementHomeRoutingModule {}
