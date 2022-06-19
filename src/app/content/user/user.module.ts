import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/share.module';

import { UserLoginComponent } from './user-login.component';
import { UserProfileComponent } from './user-profile.component';
import { UserRoutingModule } from './user.routing';


@NgModule({
    declarations: [
        // page
        UserLoginComponent,
        UserProfileComponent,
    ],
    imports: [SharedModule, UserRoutingModule],
    providers: [],
    exports: [],
})
export class UserModule {}
