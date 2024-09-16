import { Component, input, output, viewChild } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Theme } from 'src/app/interface/interface';

import { DialogComponent as DialogComponent_1 } from '../../components/dialog/dialog.component';
import { ThemeIconComponent } from '../../components/theme-icon/theme-icon.component';

@Component({
    selector: 'classement-themes',
    templateUrl: './classement-themes.component.html',
    styleUrls: ['./classement-themes.component.scss'],
    standalone: true,
    imports: [DialogComponent_1, ThemeIconComponent, TranslocoPipe],
})
export class ClassementThemesComponent {
    themes = input.required<Theme[]>();

    change = output<Theme>();

    dialog = viewChild.required<DialogComponent>(DialogComponent);

    currentTheme?: Theme;

    changeTheme(theme: Theme) {
        this.currentTheme = theme;
    }

    cancel() {
        this.currentTheme = undefined;
        this.dialog().close();
    }

    validate() {
        if (this.currentTheme) {
            this.change.emit(this.currentTheme);
        }
        this.cancel();
    }
}
