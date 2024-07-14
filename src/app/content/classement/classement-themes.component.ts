import { Component, input, output, viewChild } from '@angular/core';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Theme } from 'src/app/interface/interface';

@Component({
    selector: 'classement-themes',
    templateUrl: './classement-themes.component.html',
    styleUrls: ['./classement-themes.component.scss'],
})
export class ClassementThemesComponent {
    themes = input.required<Theme[]>();

    change = output<Theme>();

    dialog = viewChild<DialogComponent>(DialogComponent);

    currentTheme?: Theme;

    changeTheme(theme: Theme) {
        this.currentTheme = theme;
    }

    cancel() {
        this.currentTheme = undefined;
        this.dialog()!.close();
    }

    validate() {
        if (this.currentTheme) {
            this.change.emit(this.currentTheme);
        }
        this.cancel();
    }
}
