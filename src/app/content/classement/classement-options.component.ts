import { Component, HostListener, Input, ViewChild } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { FileHandle, Options, Theme } from 'src/app/interface';
import { typesMine } from 'src/app/services/global.service';
import { OptimiseImageService } from 'src/app/services/optimise-image.service';
import { Utils } from 'src/app/tools/utils';
import { environment } from 'src/environments/environment';

import { categories, imagesThemes } from './classement-default';
import { ClassemenThemesComponent } from './classement-themes.component';

@Component({
    selector: 'classement-options',
    templateUrl: './classement-options.component.html',
    styleUrls: ['./classement-options.component.scss'],
})
export class ClassementOptionsComponent {
    api = environment.api?.active || false;

    categories = categories;

    categoriesList: { value: string; label: string }[] = [];

    @Input() options?: Options;

    @Input() tags: string[] = [];

    @Input() lockCategory = false;

    imageListOpen = false;

    listThemes = imagesThemes;

    @ViewChild(ClassemenThemesComponent) classemenThemes!: ClassemenThemesComponent;

    constructor(private optimiseImage: OptimiseImageService, private translate: TranslateService) {
        this.sort();
        this.translate.onLangChange.subscribe(() => {
            this.sort();
        });
    }

    sort() {
        this.categoriesList = categories.map<{ value: string; label: string }>(category => ({
            value: category,
            label: this.translate.instant(`category.${category}`),
        }));
        this.categoriesList.sort((a, b) =>
            a.value === 'other' ? 1 : b.value === 'other' ? -1 : a.label.localeCompare(b.label),
        );
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
        this.classemenThemes.dialog.open();
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
