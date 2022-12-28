import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/share.module';

import { UserInformationComponent } from './user-information.component';
import { UserListComponent } from './user-list.component';
import { UserLoginAouthComponent } from './user-login-oauth.component';
import { UserLoginComponent } from './user-login.component';
import { UserProfileComponent } from './user-profile.component';
import { UserPwLostChangeComponent } from './user-pw-lost-change.component';
import { UserPwLostComponent } from './user-pw-lost.component';
import { UserSignupValidateComponent } from './user-signup-validate.component';
import { UserSignupComponent } from './user-signup.component';
import { UserRoutingModule } from './user.routing';

import { ClassementListModule } from '../list/classement-list.module';

@NgModule({
    declarations: [
        // page
        UserLoginComponent,
        UserLoginAouthComponent,
        UserProfileComponent,
        UserSignupComponent,
        UserSignupValidateComponent,
        UserPwLostComponent,
        UserPwLostChangeComponent,
        UserInformationComponent,
        UserListComponent,
    ],
    imports: [SharedModule, UserRoutingModule, ClassementListModule, ReactiveFormsModule],
    providers: [],
    exports: [],
})
export class UserModule {}
