import { Component, Input } from '@angular/core';

import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

import { DialogComponent } from 'src/app/components/dialog.component';
import { Classement, FileString, FormatedGroup, Options } from 'src/app/interface';
import { APIUserService } from 'src/app/services/api.user.service';
import { OptimiseImageService } from 'src/app/services/optimise-image.service';

import { categories } from './classement-default';


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

    categories = categories;

    imageChangedEvent: any = '';
    croppedImage: any = '';

    constructor(private userService: APIUserService, private optimiseImage: OptimiseImageService) {
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

    async imageCropped(event: ImageCroppedEvent) {
        if (this.classement && event.base64) {
            const banner = await this.optimiseImage.resize(
                {
                    name: 'banner',
                    url: event.base64,
                    realSize: event.base64.length,
                    date: new Date().getTime(),
                    size: 0,
                    type: 'image/png',
                },
                300,
                300,
            );
            this.classement.banner = banner.reduceFile?.url || banner.sourceFile.url!;
            this.croppedImage = this.classement.banner;
        }
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
