import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Theme } from 'src/app/interface/interface';

@Component({
    selector: 'classement-themes',
    templateUrl: './classement-themes.component.html',
    styleUrls: ['./classement-themes.component.scss'],
})
export class ClassementThemesComponent {
    currentTheme?: Theme;

    @Input()
    themes?: Theme[];

    @ViewChild(DialogComponent) dialog!: DialogComponent;

    @Output()
    change = new EventEmitter<Theme>();

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
