import { Component, OnInit, inject, input, output, viewChild } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Options, Theme } from 'src/app/interface/interface';
import { DBService } from 'src/app/services/db.service';

import { ThemeIconComponent } from '../../components/theme-icon/theme-icon.component';

@Component({
    selector: 'classement-themes',
    templateUrl: './classement-themes.component.html',
    styleUrls: ['./classement-themes.component.scss'],
    standalone: true,
    imports: [DialogComponent, ThemeIconComponent, TranslocoPipe],
})
export class ClassementThemesComponent implements OnInit {
    // inject

    private readonly dbService = inject(DBService);

    themes = input.required<Theme[]>();
    options = input.required<Options>();

    change = output<Theme>();

    dialog = viewChild.required<DialogComponent>(DialogComponent);

    currentTheme?: Theme;
    themeDraft: Theme<string>[] = [];

    async ngOnInit() {
        this.themeDraft = (await this.dbService.getLocalAllThemes()).filter(
            t => t.options.mode.replace('teams', 'default') === this.options().mode.replace('teams', 'default'),
        );
    }

    changeTheme(theme: Theme<any>) {
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
