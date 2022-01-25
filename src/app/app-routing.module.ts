import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassementEditComponent } from './classement/classement-edit.component';
import { AppHomeComponent } from './home/app-home.component';

const routes: Routes = [
    {
        path: '',
        component: AppHomeComponent,
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
