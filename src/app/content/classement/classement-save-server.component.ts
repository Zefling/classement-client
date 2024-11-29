import {
    Component,
    ElementRef,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    inject,
    input,
    output,
    viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { Select2Module } from 'ng-select2-component';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MessageService, MessageType } from 'src/app/components/info-messages/info-messages.component';
import { Category, Classement, FileHandle, FileType, FormattedGroup, Options } from 'src/app/interface/interface';
import { APIClassementService, UploadProgress } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';

import { LoaderComponent } from '../../components/loader/loader.component';
import { DropImageDirective } from '../../directives/drop-image.directive';
import { TooltipDirective } from '../../directives/tooltip.directive';

@Component({
    selector: 'classement-save-server',
    templateUrl: './classement-save-server.component.html',
    styleUrls: ['./classement-save-server.component.css'],
    imports: [
        DropImageDirective,
        FormsModule,
        Select2Module,
        ImageCropperComponent,
        TooltipDirective,
        LoaderComponent,
        TranslocoPipe,
    ],
})
export class ClassementSaveServerComponent implements OnChanges, OnDestroy {
    private readonly userService = inject(APIUserService);
    private readonly classementService = inject(APIClassementService);
    private readonly messageService = inject(MessageService);
    private readonly translate = inject(TranslocoService);
    private readonly categories = inject(CategoriesService);

    // input

    classement = input<Classement>();
    groups = input<FormattedGroup[]>();
    list = input<FileType[]>();
    options = input<Options>();
    dialog = input<DialogComponent>();

    // output

    action = output<{ type: 'save' | 'remove'; classement: Classement }>();

    // viewChild

    bannerInput = viewChild.required<ElementRef<HTMLInputElement>>('bannerInput');

    update = false;

    categoriesList: Category[] = [];

    password = '';
    linkId = '';
    linkIdValid?: boolean;
    linkChange = false;
    saveLocal = false;

    imageChangedEvent?: Event;
    imageBase64: string = '';
    croppedImage?: string;

    hidden = false;
    history = false;
    loading = false;
    progress?: UploadProgress;

    showError: string[] = [];

    private _sub = Subscriptions.instance();

    constructor() {
        this.userService.loggedStatus().then(() => {
            if (this.userService.logged) {
                if (this.userService.user!.username === this.classement()?.user) {
                    this.update = true;
                    this.history = false;
                    this.hidden = this.classement()?.hidden ?? false;
                }
            } else {
                this.dialog()?.close();
            }
        });

        this.categoryUpdate();

        this._sub.push(
            this.categories.onChange.subscribe(() => {
                this.categoryUpdate();
            }),
            this.classementService.progressValue.subscribe(value => {
                if (this.loading) {
                    this.progress = value;
                }
            }),
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['classement'] && this.classement()?.hidden !== undefined) {
            this.hidden = this.classement()!.hidden || false;
        }
    }

    ngOnDestroy() {
        this._sub.clear();
    }

    cancel() {
        this.dialog()?.close();
    }

    validate() {
        this.showError = [];

        const current = this.classement();
        const options = this.options();

        const list = this.list();
        const groups = this.groups();

        const sameUserEdit = this.userService.user?.username === current?.user;

        // format data for server save
        const classement: Classement = {
            rankingId: sameUserEdit ? (current?.rankingId ?? null) : null,
            parentId: sameUserEdit ? (current?.parentId ?? current?.templateId ?? null) : (current?.rankingId ?? null),
            templateId: current?.templateId ?? null,
            localId: current?.localId || null,
            linkId: this.linkChange ? this.linkId : current?.linkId || null,
            name: options?.title?.trim(),
            category: options?.category,
            mode: options?.mode,
            data: { list, groups, options, name: options?.title },
            banner: this.croppedImage || current?.banner,
            hidden: this.hidden ?? false,
            password: this.password,
            history: this.history,
        } as any;

        if (!classement.name) {
            this.showError.push(this.translate.translate('error.classement.name.empty'));
        }

        if (!classement.category) {
            this.showError.push(this.translate.translate('error.classement.category.empty'));
        }

        if (!classement.banner) {
            this.showError.push(this.translate.translate('error.classement.banner.empty'));
        }

        if (classement.mode === 'teams') {
            // keep only the ids for this mode
            classement.data.groups.forEach(
                group => (group.list = group.list.map(tile => (tile ? { id: tile.id } : null) as any)),
            );
        }

        if (!this.showError.length) {
            this.loading = true;
            this.progress = undefined;
            this.classementService
                .saveClassement(classement)
                .then(classementSave => {
                    this.action.emit({ type: this.saveLocal ? 'save' : 'remove', classement: classementSave });
                    this.userService.updateClassement(classementSave);
                    this.messageService.addMessage(this.translate.translate('message.server.save.success'));
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
                .testLink(linkId.trim().replace(/\s/g, '_'), this.classement()?.rankingId)
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
        this.bannerInput().nativeElement.value = '';
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
        if (event.blob) {
            this.croppedImage = await Utils.blobToBase64(event.blob);
        }
    }

    imageLoaded(_image: LoadedImage) {
        // show cropper

        setTimeout(() => {
            // fix init position for the cropper
            window.dispatchEvent(new Event('resize'));
        }, 500);
    }

    cropperReady() {
        // cropper ready
    }

    loadImageFailed() {
        // show message
    }

    private categoryUpdate() {
        this.categoriesList = this.categories.categoriesList;
    }
}
