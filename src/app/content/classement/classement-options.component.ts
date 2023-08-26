import { Component, ElementRef, Host, Input, OnDestroy, ViewChild } from '@angular/core';

import { Select2Data, Select2Option } from 'ng-select2-component';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Category, FileHandle, ModeNames, Options, Theme } from 'src/app/interface';
import { CategoriesService } from 'src/app/services/categories.service';
import { typesMine } from 'src/app/services/global.service';
import { OptimiseImageService } from 'src/app/services/optimise-image.service';
import { Subscriptions } from 'src/app/tools/subscriptions';
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

    listThemes!: Select2Data;

    @ViewChild(ClassemenThemesComponent) classementThemes!: ClassemenThemesComponent;
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

        this.updateList();
    }

    updateList() {
        this.listThemes = imagesThemes.map<Select2Option>(e => ({
            value: e,
            label: e,
            data: {
                image: this.getImageUrl(e),
                label: e,
            },
        }));
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
            this.options!.mode = this._modeTemp!;
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
        Object.assign(this.options!, theme.options, {
            title: this.options!.title,
            category: this.options!.category,
            autoSave: this.options!.autoSave,
            streamMode: this.options!.streamMode,
            itemWidthAuto: this.options!.itemWidthAuto,
        });
    }

    changeCustomBackground(event: string | FileHandle) {
        if ((event as FileHandle).target) {
            this.updateImageBackgroundCustom((event as FileHandle).target?.result as string);
            this.updateList();
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

    private getImageUrl(item: string) {
        switch (item) {
            case 'none':
                return null;
            case 'custom':
                return this.options ? `url(${this.options.imageBackgroundCustom})` : 'none';
            default:
                return `url(./assets/themes/${item}.mini.svg)`;
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
