import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MessageService, MessageType } from 'src/app/components/info-messages/info-messages.component';
import { Classement, FileHandle, FileString, FormatedGroup, Options } from 'src/app/interface';
import { APIClassementService, UploadProgress } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

import { categories } from './classement-default';

@Component({
    selector: 'classement-save-server',
    templateUrl: './classement-save-server.component.html',
    styleUrls: ['./classement-save-server.component.scss'],
})
export class ClassementSaveServerComponent implements OnChanges, OnDestroy {
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

    @Output()
    save = new EventEmitter<Classement>();

    update = false;

    categories = categories;

    password = '';
    linkId = '';
    linkIdValid?: boolean;
    linkChange = false;

    @ViewChild('bannerInput') bannerInput!: ElementRef<HTMLInputElement>;
    @ViewChild('imageCropper') imageCropper!: ImageCropperComponent;

    imageChangedEvent?: Event;
    imageBase64: string = '';
    croppedImage?: string;

    hidden = false;
    history = false;
    loading = false;
    progress?: UploadProgress;

    showError: string[] = [];

    private _sub = Subscriptions.instance();

    constructor(
        private readonly userService: APIUserService,
        private readonly classementService: APIClassementService,
        private readonly messageService: MessageService,
        private readonly translate: TranslateService,
    ) {
        this.userService.loggedStatus().then(() => {
            if (this.userService.logged) {
                if (this.userService.user!.username === this.classement?.user) {
                    this.update = true;
                    this.history = false;
                }
            } else {
                this.dialog?.close();
            }
        });

        this._sub.push(
            this.classementService.progressValue.subscribe(value => {
                if (this.loading) {
                    this.progress = value;
                }
            }),
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['classement']) {
            if (this.classement?.hidden) {
                this.hidden = this.classement.hidden;
            }
        }
    }

    ngOnDestroy() {
        this._sub.clear();
    }

    cancel() {
        this.dialog?.close();
    }

    validate() {
        this.showError = [];

        const sameUserEdit = this.userService.user?.username === this.classement?.user;

        // format data for server save
        const classement: Classement = {
            rankingId: sameUserEdit ? this.classement?.rankingId ?? null : null,
            parendId: sameUserEdit
                ? this.classement?.parentId ?? this.classement?.templateId ?? null
                : this.classement?.rankingId ?? null,
            templateId: this.classement?.templateId ?? null,
            localId: this.classement?.localId || null,
            linkId: this.linkChange ? this.linkId : this.classement?.linkId || null,
            name: this.options?.title?.trim(),
            category: this.options?.category,
            mode: this.options?.mode,
            data: { list: this.list, groups: this.groups, options: this.options, name: this.options?.title },
            banner: this.croppedImage || this.classement?.banner,
            hidden: this.hidden ?? this.classement?.hidden ?? false,
            password: this.password,
            history: this.history,
        } as any;

        if (!classement.name) {
            this.showError.push(this.translate.instant('error.classement.name.empty'));
        }

        if (!classement.category) {
            this.showError.push(this.translate.instant('error.classement.category.empty'));
        }

        if (!classement.banner) {
            this.showError.push(this.translate.instant('error.classement.banner.empty'));
        }

        if (classement.mode === 'teams') {
            // keep only the ids for this mode
            classement.data.groups.forEach(group => (group.list = group.list.map(tile => ({ id: tile.id } as any))));
        }

        if (!this.showError.length) {
            this.loading = true;
            this.progress = undefined;
            this.classementService
                .saveClassement(classement)
                .then(classementSave => {
                    this.save.emit(classementSave);
                    this.userService.updateClassement(classementSave);
                    this.messageService.addMessage(this.translate.instant('message.server.save.success'));
                    this.cancel();
                })
                .catch(e => {
                    this.messageService.addMessage(e, { type: MessageType.error });
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }

    testLink(linkId: string) {
        if (linkId.trim()) {
            this.classementService
                .testLink(linkId.trim().replace(/\s/g, '_'), this.classement?.rankingId)
                .then(linkIdValid => {
                    this.linkIdValid = linkIdValid;
                });
        } else {
            this.linkIdValid = undefined;
        }
        this.linkChange = true;
    }

    linkFormat(event: FocusEvent) {
        this.linkId = (event.target as HTMLInputElement).value.trim().replace(/\s/g, '_');
    }

    resetBanner() {
        this.croppedImage = undefined;
        this.imageChangedEvent = undefined;
        this.bannerInput.nativeElement.value = '';
    }

    fileChangeEvent(event: Event): void {
        this.imageChangedEvent = event;
    }

    fileChange(event: FileHandle | string) {
        if ((event as FileHandle).target) {
            this.imageBase64 = (event as FileHandle).target?.result as string;
        }
    }

    async imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64!;
    }

    imageLoaded(_image: LoadedImage) {
        // show cropper
        setTimeout(() => {
            // fix init position for the cropper
            this.imageCropper.resetCropperPosition();
        });
    }

    cropperReady() {
        // cropper ready
    }

    loadImageFailed() {
        // show message
    }
}
