import { JsonPipe } from '@angular/common';
import {
    Component,
    ElementRef,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    inject,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
    MagmaDialog,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputPassword,
    MagmaInputSelect,
    MagmaInputText,
    MagmaLoader,
    MagmaLoaderMessage,
    MagmaMessage,
    MagmaMessageType,
    MagmaProgress,
    MagmaSpinner,
    MagmaTooltipDirective,
} from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';

import { Category, Classement, FileHandle, FileType, FormattedGroup, Options } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';

import { DropImageDirective } from '../../directives/drop-image.directive';

@Component({
    selector: 'classement-save-server',
    templateUrl: './classement-save-server.component.html',
    styleUrls: ['./classement-save-server.component.scss'],
    imports: [
        DropImageDirective,
        FormsModule,
        ImageCropperComponent,
        MagmaTooltipDirective,
        TranslocoPipe,
        MagmaInput,
        MagmaInputText,
        MagmaInputElement,
        MagmaInputSelect,
        MagmaInputCheckbox,
        MagmaInputPassword,
        MagmaLoader,
        MagmaLoaderMessage,
        MagmaSpinner,
        MagmaProgress,
        JsonPipe,
    ],
})
export class ClassementSaveServerComponent implements OnChanges, OnDestroy {
    private readonly global = inject(GlobalService);
    private readonly userService = inject(APIUserService);
    private readonly classementService = inject(APIClassementService);
    private readonly mgMessage = inject(MagmaMessage);
    private readonly translate = inject(TranslocoService);
    private readonly categories = inject(CategoriesService);

    // input

    classement = input<Classement>();
    groups = input<FormattedGroup[]>();
    list = input<FileType[]>();
    options = input<Options>();
    dialog = input<MagmaDialog>();

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
    adult = false;

    lang = this.global.lang;
    step = signal<'read' | 'send' | 'save'>('read');
    loaded = signal<number | undefined>(undefined);
    total = signal<number | undefined>(undefined);

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
                    this.loaded.set(value.loaded);
                    this.total.set(value.total);
                    if (value.loaded < value.total) {
                        this.step.set('send');
                    } else {
                        this.step.set('save');
                    }
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
            adult: this.adult,
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
            this.step.set('read');
            this.loaded.set(undefined);
            this.total.set(undefined);
            this.classementService
                .saveClassement(classement)
                .then(classementSave => {
                    this.action.emit({ type: this.saveLocal ? 'save' : 'remove', classement: classementSave });
                    this.userService.updateClassement(classementSave);
                    this.mgMessage.addMessage(this.translate.translate('message.server.save.success'));
                    this.cancel();
                })
                .catch(e => {
                    this.mgMessage.addMessage(e, { type: MagmaMessageType.error });
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }

    testLink(linkId: string) {
        if (linkId.trim()) {
            const value = linkId.trim().replace(/\s/g, '_');
            this.classementService.testLink(value, this.classement()?.rankingId).then(linkIdValid => {
                this.linkIdValid = linkIdValid;
                this.linkId = value;
            });
        } else {
            this.linkIdValid = undefined;
        }
        this.linkChange = true;
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
