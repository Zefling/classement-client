import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { DialogComponent } from 'src/app/components/dialog.component';
import { MessageService } from 'src/app/components/info-messages.component';
import { Classement, User } from 'src/app/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';


@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnDestroy {
    user?: User;

    listener: Subscription[] = [];

    @ViewChild('dialogChangePassword') dialogChangePassword!: DialogComponent;
    changePasswordForm: FormGroup;

    @ViewChild('dialogChangeEmail') dialogChangeEmail!: DialogComponent;
    changeEmailForm: FormGroup;
    emailExist = false;

    @ViewChild('dialogRemoveClassement') dialogRemoveClassement!: DialogComponent;
    currentClassement?: Classement;

    @ViewChild('dialogRemoveProfile') dialogRemoveProfile!: DialogComponent;

    constructor(
        private router: Router,
        private userService: APIUserService,
        private classementService: APIClassementService,
        private messageService: MessageService,
        private translate: TranslateService,
    ) {
        this.listener.push(
            this.userService.afterLoggin.subscribe(() => {
                if (!this.userService.logged) {
                    this.router.navigate(['/profil/login']);
                } else {
                    this.user = this.userService.user;
                }
            }),
            this.userService.afterLogout.subscribe(() => {
                this.router.navigate(['/user/login']);
            }),
        );

        if (!this.userService.token) {
            this.router.navigate(['/user/login']);
        }

        this.user = this.userService.user;

        this.changePasswordForm = new FormGroup({
            passwordOld: new FormControl(''),
            password: new FormControl(''),
            password2: new FormControl(''),
        });
        this.changeEmailForm = new FormGroup({
            emailOld: new FormControl(''),
            emailNew: new FormControl(''),
        });
    }

    changePassword(): void {
        this.dialogChangePassword.open();
    }

    changeEmail(): void {
        this.dialogChangeEmail.open();
    }

    ngOnDestroy(): void {
        this.listener.forEach(e => e.unsubscribe());
    }

    delete(classement: Classement): void {
        this.currentClassement = classement;
        this.dialogRemoveClassement.open();
    }

    deleteCurrentClassement(remove: boolean): void {
        if (remove) {
            this.classementService.deleteClassement(this.currentClassement!.rankingId).then(() => {
                this.user?.classements.splice(this.user?.classements.indexOf(this.currentClassement!), 1);
                this.messageService.addMessage(this.translate.instant('message.server.remove.success'));
            });
        } else {
            this.currentClassement = undefined;
        }
        this.dialogRemoveClassement.close();
    }
}
