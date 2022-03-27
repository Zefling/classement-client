import { Component, Input, ViewChild } from '@angular/core';

import { Options, Theme } from 'src/app/interface';

import { categories } from './classement-default';
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

    @ViewChild(ClassemenThemesComponent) classemenThemes!: ClassemenThemesComponent;

    constructor() {}

    switchOptions() {
        if (this.options) {
            this.options.showAdvancedOptions = !this.options.showAdvancedOptions;
        }
    }

    themesOpen() {
        this.classemenThemes.dialog.open();
    }

    changeTheme(theme: Theme) {
        Object.assign(this.options, theme.options);
    }
}
