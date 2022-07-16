import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/share.module';

import { AdminClassementsComponent } from './admin-classements.component';
import { AdminUsersComponent } from './admin-users.component';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin.routing';
import { ListClassementsComponent } from './list-classements.component';


@NgModule({
    declarations: [
        // page
        AdminComponent,
        AdminUsersComponent,
        AdminClassementsComponent,
        ListClassementsComponent,
    ],
    imports: [SharedModule, AdminRoutingModule, ReactiveFormsModule],
    providers: [],
    exports: [],
})
export class AdminModule {}
