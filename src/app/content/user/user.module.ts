import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/share.module';

import { UserInformationComponent } from './user-information.component';
import { UserLoginComponent } from './user-login.component';
import { UserProfileComponent } from './user-profile.component';
import { UserPwLostChangeComponent } from './user-pw-lost-change.component';
import { UserPwLostComponent } from './user-pw-lost.component';
import { UserSignupValidateComponent } from './user-signup-validate.component';
import { UserSignupComponent } from './user-signup.component';
import { UserRoutingModule } from './user.routing';


@NgModule({
    declarations: [
        // page
        UserLoginComponent,
        UserProfileComponent,
        UserSignupComponent,
        UserSignupValidateComponent,
        UserPwLostComponent,
        UserPwLostChangeComponent,
        UserInformationComponent,
    ],
    imports: [SharedModule, UserRoutingModule, ReactiveFormsModule],
    providers: [],
    exports: [],
})
export class UserModule {}
