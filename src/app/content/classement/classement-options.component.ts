import { Component, HostListener, Input, ViewChild } from '@angular/core';

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

    @Input()
    options?: Options;

    imageListOpen = false;

    listThemes = imagesThemes;

    @ViewChild(ClassemenThemesComponent) classemenThemes!: ClassemenThemesComponent;

    switchOptions() {
        if (this.options) {
            this.options.showAdvancedOptions = !this.options.showAdvancedOptions;
        }
    }

    themesOpen() {
        this.classemenThemes.dialog.open();
    }

    changeTheme(theme: Theme) {
        Object.assign(this.options!, theme.options);
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
