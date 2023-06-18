import { Component, Host, HostListener, Input, OnDestroy, ViewChild } from '@angular/core';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Category, FileHandle, ModeNames, Options, Theme } from 'src/app/interface';
import { CategoriesService } from 'src/app/services/categories.service';
import { typesMine } from 'src/app/services/global.service';
import { OptimiseImageService } from 'src/app/services/optimise-image.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';
import { environment } from 'src/environments/environment';

import { imagesThemes } from './classement-default';
import { ClassementEditComponent } from './classement-edit.component';
import { ClassemenThemesComponent } from './classement-themes.component';

@Component({
    selector: 'classement-options',
    templateUrl: './classement-options.component.html',
    styleUrls: ['./classement-options.component.scss'],
})
export class ClassementOptionsComponent implements OnDestroy {
    api = environment.api?.active || false;

    categoriesList: Category[] = [];

    @Input() options?: Options;

    @Input() lockCategory = false;

    imageListOpen = false;

    listThemes = imagesThemes;

    @ViewChild(ClassemenThemesComponent) classementThemes!: ClassemenThemesComponent;
    @ViewChild('dialogChangeMode') dialogChangeMode!: DialogComponent;

    private _sub = Subscriptions.instance();
    private modeTemp?: ModeNames;

    constructor(
        private readonly optimiseImage: OptimiseImageService,
        private readonly categories: CategoriesService,
        @Host() private readonly editor: ClassementEditComponent,
    ) {
        this.categoryUpdate();
        this._sub.push(
            this.categories.onChange.subscribe(() => {
                this.categoryUpdate();
            }),
        );
    }

    ngOnDestroy(): void {
        this._sub.clear();
    }

    modeChange(event: ModeNames) {
        this.dialogChangeMode.open();
        this.modeTemp = event;
    }

    modeChangeOk() {
        this.editor.reset();
        this.options!.mode = this.modeTemp!;
    }

    switchOptions() {
        if (this.options) {
            this.options.showAdvancedOptions = !this.options.showAdvancedOptions;
        }
    }

    updateTags(tags: string[]) {
        if (this.options) {
            this.options.tags = tags;
        }
    }

    themesOpen() {
        this.classementThemes.dialog.open();
    }

    changeTheme(theme: Theme) {
        Object.assign(this.options!, theme.options, {
            title: this.options!.title,
            category: this.options!.category,
            autoSave: this.options!.autoSave,
            itemWidthAuto: this.options!.itemWidthAuto,
        });
    }

    toggleImageList() {
        this.imageListOpen = !this.imageListOpen;
    }

    changeImage(image: string) {
        this.options!.imageBackgroundImage = image;
        this.toggleImageList();
    }

    @HostListener('window:click', ['$event'])
    onClickOver(event: MouseEvent) {
        if (this.imageListOpen && !Utils.getParentElementByClass(event.target as HTMLElement, 'list-options')) {
            this.toggleImageList();
        }
    }

    getImageUrl(item: string) {
        switch (item) {
            case 'none':
                return null;
            case 'custom':
                return `url(${this.options!.imageBackgroundCustom})`;
            default:
                return `url(./assets/themes/${item}.mini.svg)`;
        }
    }

    changeCustomeBackground(event: string | FileHandle) {
        if ((event as FileHandle).target) {
            this.updateImageBackgroundCustom((event as FileHandle).target?.result as string);
        }
    }

    changeCustomeBackgroundEvent(event: Event) {
        const files = (event.target as any).files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (typesMine['image'].includes(file.type)) {
                const data: FileHandle = {
                    file,
                };

                let reader = new FileReader();
                reader.onload = (ev: ProgressEvent<FileReader>) => {
                    data.target = ev.target;
                };
                reader.onloadend = (_ev: ProgressEvent<FileReader>) => {
                    this.updateImageBackgroundCustom(String(data.target?.result));
                };
                reader.readAsDataURL(data.file);
            }
        }
    }

    private categoryUpdate() {
        this.categoriesList = this.categories.categoriesList;
    }

    private updateImageBackgroundCustom(image: string) {
        this.optimiseImage
            .resize(
                {
                    url: image,
                    name: 'background',
                    size: image.length,
                    realSize: image.length,
                    type: 'image',
                    date: 0,
                },
                1000,
                1000,
            )
            .then(file => {
                this.options!.imageBackgroundCustom = file.reduceFile?.url || file.sourceFile.type;
            });
    }
}
