import { NgModule } from '@angular/core';

import { ImageCropperComponent } from 'ngx-image-cropper';

import { SharedModule } from 'src/app/share.module';

import { UserInformationComponent } from './user-information.component';
import { UserListComponent } from './user-list.component';
import { UserLoginOauthComponent } from './user-login-oauth.component';
import { UserLoginComponent } from './user-login.component';
import { UserProfileComponent } from './user-profile.component';
import { UserPwLostChangeComponent } from './user-pw-lost-change.component';
import { UserPwLostComponent } from './user-pw-lost.component';
import { UserSignupValidateComponent } from './user-signup-validate.component';
import { UserSignupComponent } from './user-signup.component';
import { UserViewComponent } from './user-view.component';
import { UserRoutingModule } from './user.routing';

import { ClassementListModule } from '../list/classement-list.module';

@NgModule({
    imports: [
        SharedModule,
        UserRoutingModule,
        ClassementListModule,
        ImageCropperComponent,
        // page
        UserLoginComponent,
        UserLoginOauthComponent,
        UserProfileComponent,
        UserSignupComponent,
        UserSignupValidateComponent,
        UserPwLostComponent,
        UserPwLostChangeComponent,
        UserInformationComponent,
        UserListComponent,
        UserViewComponent,
    ],
    providers: [],
    exports: [],
})
export class UserModule {}
