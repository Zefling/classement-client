import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { DialogComponent } from 'src/app/components/dialog.component';
import { Theme } from 'src/app/interface';

import { themesList } from './classement-default';


@Component({
    selector: 'classement-themes',
    templateUrl: './classement-themes.component.html',
    styleUrls: ['./classement-themes.component.scss'],
})
export class ClassemenThemesComponent {
    currentTheme?: Theme;

    themes = themesList;

    @ViewChild(DialogComponent) dialog!: DialogComponent;

    @Output()
    change = new EventEmitter<Theme>();

    constructor() {}

    changeTheme(theme: Theme) {
        this.currentTheme = theme;
    }

    cancel() {
        this.currentTheme = undefined;
        this.dialog.close();
    }

    validate() {
        this.change.emit(this.currentTheme);
        this.cancel();
    }
}