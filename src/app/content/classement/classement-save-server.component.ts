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
    MagmaMessages,
    MagmaProgress,
    MagmaSpinner,
    MagmaTooltipDirective,
    blobToBase64,
} from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';

import { Category, Classement, FileHandle, FileType, FormattedGroup, Options } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { GlobalService } from 'src/app/services/global.service';
import { boolean, inList, minMax } from 'src/app/tools/function';
import { Subscriptions } from 'src/app/tools/subscriptions';

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
        MagmaMessage,
    ],
})
export class ClassementSaveServerComponent implements OnChanges, OnDestroy {
    private readonly global = inject(GlobalService);
    private readonly userService = inject(APIUserService);
    private readonly classementService = inject(APIClassementService);
    private readonly mgMessage = inject(MagmaMessages);
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

        if (options) {
            this.fixOptions(options);
        }

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

    fixOptions(options: Options) {
        options.titleTextOpacity = minMax(options.titleTextOpacity ?? 100, 0, 100, 1);
        options.itemWidth = minMax(options.itemWidth ?? 100, 16, 300, 1);
        options.itemWidthAuto = boolean(options.itemWidthAuto ?? true);
        options.itemImageCover = inList(options.itemImageCover ?? true, [true, false, 'opti']);
        options.itemMaxWidth = minMax(options.itemMaxWidth ?? 300, 16, 300, 1);
        options.itemHeight = minMax(options.itemHeight ?? 100, 16, 300, 1);
        options.itemHeightAuto = boolean(options.itemHeightAuto ?? false);
        options.itemMaxHeight = minMax(options.itemMaxHeight ?? 300, 16, 300, 1);
        options.itemPadding = minMax(options.itemPadding ?? 0, 0, 20, 1);
        options.itemMargin = minMax(options.itemMargin ?? 0, 0, 20, 1);
        options.itemBackgroundOpacity = minMax(options.itemBackgroundOpacity ?? 40, 0, 100, 1);
        options.itemBorderOpacity = minMax(options.itemBorderOpacity ?? 30, 0, 100, 1);
        options.itemTextMinLine = minMax(options.itemTextMinLine ?? 0, 0, 10, 1);
        options.itemTextMaxLine = minMax(options.itemTextMaxLine ?? 10, 0, 10, 1);
        options.itemTextSize = minMax(options.itemTextSize ?? 12, 6, 100, 1);
        options.itemTextOnlySize = minMax(options.itemTextOnlySize ?? 24, 6, 100, 1);
        options.itemTextPosition = inList(options.itemTextPosition ?? 'bottom', [
            'hidden',
            'bottom',
            'bottom-over',
            'bottom-over-hover',
            'bottom-bubble',
            'top',
            'top-over',
            'top-over-hover',
            'top-bubble',
        ]);

        options.itemTextBackgroundOpacity = minMax(options.itemTextBackgroundOpacity ?? 80, 0, 100, 1);
        options.lineBackgroundOpacity = minMax(options.lineBackgroundOpacity ?? 60, 0, 100, 1);
        options.lineBorderOpacity = minMax(options.lineBorderOpacity ?? 60, 0, 100, 1);
        options.imageBackgroundImage = inList(options.imageBackgroundImage ?? 'none', [
            'none',
            'custom',
            'sakura',
            'etoile',
            'ciel',
            'iceberg',
            'axis',
        ]);
        options.imageWidth = minMax(options.imageWidth ?? 1170, 100, 4000, 1);
        options.imageHeight = minMax(options.imageHeight ?? 1000, 100, 4000, 1);
        options.imageSize = inList(options.imageSize ?? 'center', ['', 'cover']);
        options.imagePosition = inList(options.imagePosition, ['', 'center']);
        options.columnMinHeight = minMax(options.columnMinHeight ?? 250, 0, 4000, 1);
        options.axisLineWidth = minMax(options.axisLineWidth ?? 3, 0, 12, 1);
        options.axisArrowWidth = minMax(options.axisArrowWidth ?? 15, 0, 50, 1);
        options.nameWidth = minMax(options.nameWidth ?? 90, 50, 300, 1);
        options.nameMinHeight = minMax(options.nameMinHeight, 0, 300, 1);
        options.nameFontSize = minMax(options.nameFontSize ?? 120, 50, 300, 1);
        options.nameBackgroundOpacity = minMax(options.nameBackgroundOpacity ?? 100, 0, 100, 1);
        options.nameMarkdown = boolean(options.nameMarkdown);
        options.borderRadius = minMax(options.borderRadius ?? 4, 0, 50, 1);
        options.borderSpacing = minMax(options.borderSpacing ?? 1, -1, 20, 1);
        options.borderSize = minMax(options.borderSize ?? 1, 0, 20, 1);
        options.groupLineSize = minMax(options.groupLineSize ?? 1, 0, 50, 1);
        options.groupLineOpacity = minMax(options.groupLineOpacity ?? 80, 0, 100, 1);
        options.direction = inList(options.direction ?? 'ltr', ['ltr', 'rtl']);
        options.sizeX = minMax(options.sizeX ?? 5, 2, 20, 1);
        options.sizeY = minMax(options.sizeY ?? 5, 2, 20, 1);
        options.streamMode = boolean(options.streamMode);
        options.autoSave = boolean(options.autoSave);
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
            this.croppedImage = await blobToBase64(event.blob);
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
