import { Component, ElementRef, Host, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';

import { Select2Data, Select2Option } from 'ng-select2-component';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Category, FileHandle, ImagesNames, ModeNames, Options, Theme, ThemesNames } from 'src/app/interface/interface';
import { CategoriesService } from 'src/app/services/categories.service';
import { typesMine } from 'src/app/services/global.service';
import { OptimiseImageService } from 'src/app/services/optimise-image.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { environment } from 'src/environments/environment';

import {
    imageInfos,
    imagesAxis,
    imagesIceberg,
    imagesLists,
    imagesThemes,
    themes,
    themesAxis,
    themesIceberg,
    themesList,
    themesLists,
} from './classement-default';
import { ClassementEditComponent } from './classement-edit.component';
import { ClassementThemesComponent } from './classement-themes.component';

@Component({
    selector: 'classement-options',
    templateUrl: './classement-options.component.html',
    styleUrls: ['./classement-options.component.scss'],
})
export class ClassementOptionsComponent implements OnChanges, OnDestroy {
    api = environment.api?.active || false;

    categoriesList: Category[] = [];

    @Input() options?: Options;

    @Input() lockCategory = false;

    listThemes!: Select2Data;

    themes!: Theme[];

    imagesList: ImagesNames[] = imagesThemes;
    themesList: ThemesNames[] = themes;

    zoneMode: ModeNames[] = ['iceberg', 'axis'];

    @ViewChild(ClassementThemesComponent) classementThemes!: ClassementThemesComponent;
    @ViewChild('dialogChangeMode') dialogChangeMode!: DialogComponent;
    @ViewChild('mode') mode!: ElementRef<HTMLSelectElement>;

    private _sub = Subscriptions.instance();
    _modeTemp?: ModeNames;
    _previousMode?: ModeNames;

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

        this.updateMode();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['options']) {
            this.updateMode();
        }
    }

    updateMode() {
        if (this.options) {
            const theme = this._modeTemp ?? this.options.mode ?? 'default';

            switch (theme) {
                case 'iceberg':
                    this.imagesList = imagesIceberg;
                    this.themesList = themesIceberg;
                    break;
                case 'axis':
                    this.imagesList = imagesAxis;
                    this.themesList = themesAxis;
                    break;
                default:
                    this.imagesList = imagesLists;
                    this.themesList = themesLists;
                    break;
            }
            this.updateList(theme);

            this.themes = themesList.filter(e => this.themesList.includes(e.name));
        }
    }

    updateList(mode: ModeNames = this._modeTemp ?? this.options?.mode ?? 'default') {
        // list image
        this.listThemes = this.imagesList.map<Select2Option>(e => ({
            value: e,
            label: e,
            data: {
                image: this.getImageUrl(e),
                label: e,
            },
        }));
        if (this.options) {
            let modeType = mode;
            if (modeType === 'teams') {
                modeType = 'default';
            }

            // list theme
            const themeOption = themesList.find(e => e.name === this.themesList[0]);
            if (themeOption && this._previousMode && this._previousMode !== modeType) {
                this.changeTheme(themeOption);
            }
            // select mode
            this.options.mode = mode;
        }
    }

    updateListGroup(size: number) {
        if (!(size >= 0 && size <= 20)) {
            size = size >= 0 ? 20 : 1;
        }
        if (!this.options!.groups) {
            this.options!.groups = [];
        }
        if (size < this.options!.groups.length) {
            this.options!.groups.splice(size, this.options!.groups.length);
        } else if (size > this.options!.groups.length) {
            for (let i = 0; i < size - this.options!.groups.length; i++) {
                this.options!.groups.push({ title: '' });
            }
        }
    }

    ngOnDestroy(): void {
        this._sub.clear();
    }

    modeChange(previous: ModeNames, event: ModeNames) {
        this.dialogChangeMode.open();
        this._previousMode = previous;
        this._modeTemp = event;
    }

    modeChangeValid(ok: boolean) {
        if (ok) {
            this.editor.reset();
            this.updateMode();
            this.options!.itemHeightAuto = this.zoneMode.includes(this._modeTemp!);
        } else {
            this.mode.nativeElement.value = this._previousMode!;
        }
        this.dialogChangeMode.close();
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
        const mode = this.options!.mode;
        Object.assign(
            this.options!,
            theme.options,
            {
                title: this.options!.title,
                category: this.options!.category,
                autoSave: this.options!.autoSave,
                streamMode: this.options!.streamMode,
                itemWidthAuto: this.options!.itemWidthAuto,
            },
            { mode },
        );
    }

    changeCustomBackground(event: string | FileHandle) {
        if ((event as FileHandle).target) {
            this.updateImageBackgroundCustom((event as FileHandle).target?.result as string);
            this.updateMode();
        }
    }

    changeCustomBackgroundEvent(event: Event) {
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

    resetItemTextBackground() {
        this.options!.itemTextBackgroundColor = '';
        this.options!.itemTextBackgroundOpacity = 100;
    }

    resetItemBackground() {
        this.options!.itemBackgroundColor = '';
        this.options!.itemBackgroundOpacity = 100;
    }

    resetLineBackground() {
        this.options!.lineBackgroundColor = '';
        this.options!.lineBackgroundOpacity = 100;
    }

    resetLineBorder() {
        this.options!.lineBorderColor = '';
        this.options!.lineBorderOpacity = 100;
    }

    resetItemBorder() {
        this.options!.itemBorderColor = '';
        this.options!.itemBorderOpacity = 100;
    }

    resetItemText() {
        this.options!.itemTextColor = '';
        this.options!.itemTextOpacity = 100;
    }

    resetTitleText() {
        this.options!.titleTextColor = '';
        this.options!.titleTextOpacity = 100;
    }

    resetAxisLine() {
        this.options!.axisLineColor = '';
        this.options!.axisLineOpacity = 100;
    }

    updateSize(axis: 'itemHeight' | 'itemWidth') {
        if (this.options![axis] < 16) {
            this.options![axis] = 16;
        } else if (this.options![axis] > 300) {
            this.options![axis] = 300;
        }
    }

    private getImageUrl(item: ImagesNames) {
        switch (item) {
            case 'none':
                return null;
            case 'custom':
                return this.options ? `url(${this.options.imageBackgroundCustom})` : 'none';
            default:
                return `url(./assets/themes/${imageInfos[item]!.mini})`;
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
                this.updateList();
            });
    }
}
