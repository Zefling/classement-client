import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/share.module';

import { AdminClassementsComponent } from './admin-classements.component';
import { AdminUsersComponent } from './admin-users.component';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin.routing';


@NgModule({
    declarations: [
        // page
        AdminComponent,
        AdminUsersComponent,
        AdminClassementsComponent,
    ],
    imports: [SharedModule, AdminRoutingModule],
    providers: [],
    exports: [],
})
export class AdminModule {}
