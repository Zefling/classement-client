import { Component, Input } from '@angular/core';

import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

import { DialogComponent } from 'src/app/components/dialog.component';
import { Classement, FileString, FormatedGroup, Options } from 'src/app/interface';
import { APIUserService } from 'src/app/services/api.user.service';


@Component({
    selector: 'classement-save-server',
    templateUrl: './classement-save-server.component.html',
    styleUrls: ['./classement-save-server.component.scss'],
})
export class ClassementSaveServerComponent {
    @Input()
    classement?: Classement;

    @Input()
    groups?: FormatedGroup[];

    @Input()
    list?: FileString[];

    @Input()
    options?: Options;

    @Input()
    dialog?: DialogComponent;

    update = false;

    imageChangedEvent: any = '';
    croppedImage: any = '';

    constructor(private userService: APIUserService) {
        this.userService.loggedStatus().then(() => {
            if (this.userService.logged) {
                if (this.userService.user!.username === this.classement?.user) {
                    this.update = true;
                }
            } else {
                this.dialog?.close();
            }
        });
    }

    cancel() {
        this.dialog?.close();
    }

    validate() {
        this.cancel();
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }
    imageLoaded(image: LoadedImage) {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }
}
