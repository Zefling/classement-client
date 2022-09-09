import { Component, HostListener, Input, ViewChild } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Options, Theme } from 'src/app/interface';
import { Utils } from 'src/app/tools/utils';

import { categories, imagesThemes } from './classement-default';
import { ClassemenThemesComponent } from './classement-themes.component';


@Component({
    selector: 'classement-options',
    templateUrl: './classement-options.component.html',
    styleUrls: ['./classement-options.component.scss'],
})
export class ClassementOptionsComponent {
    categories = categories;

    categoriesList: { value: string; label: string }[] = [];

    @Input()
    options?: Options;

    imageListOpen = false;

    listThemes = imagesThemes;

    @ViewChild(ClassemenThemesComponent) classemenThemes!: ClassemenThemesComponent;

    constructor(private translate: TranslateService) {
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
}
