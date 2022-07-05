import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/share.module';

import { UserLoginComponent } from './user-login.component';
import { UserProfileComponent } from './user-profile.component';
import { UserPwLostComponent } from './user-pw-lost.component';
import { UserSignupComponent } from './user-signup.component';
import { UserRoutingModule } from './user.routing';


@NgModule({
    declarations: [
        // page
        UserLoginComponent,
        UserProfileComponent,
        UserSignupComponent,
        UserPwLostComponent,
    ],
    imports: [SharedModule, UserRoutingModule, ReactiveFormsModule],
    providers: [],
    exports: [],
})
export class UserModule {}
