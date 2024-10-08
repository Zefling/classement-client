import { Component, OnInit, inject, input, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { TabTitleComponent } from 'src/app/components/tabs/tab-content.component';
import { TabContentComponent } from 'src/app/components/tabs/tab-title.component';
import { TabsComponent } from 'src/app/components/tabs/tabs.component';
import { Options, Theme, ThemeData, ThemesNames, User } from 'src/app/interface/interface';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { environment } from 'src/environments/environment';

import { ThemeIconComponent } from '../../components/theme-icon/theme-icon.component';

@Component({
    selector: 'classement-themes',
    templateUrl: './classement-themes.component.html',
    styleUrls: ['./classement-themes.component.scss'],
    standalone: true,
    imports: [
        DialogComponent,
        ThemeIconComponent,
        TranslocoPipe,
        TabsComponent,
        TabContentComponent,
        TabTitleComponent,
        FormsModule,
    ],
})
export class ClassementThemesComponent implements OnInit {
    // inject

    private readonly dbService = inject(DBService);
    private readonly userService = inject(APIUserService);
    private readonly translate = inject(TranslocoService);

    // input

    themes = input.required<Theme[]>();
    options = input.required<Options>();

    // output

    change = output<Theme | Theme<string>>();

    // viewChild

    dialog = viewChild.required<DialogComponent>(DialogComponent);

    // template

    api = environment.api?.active || false;

    key?: string;

    user?: User;
    usersThemes?: ThemeData[];

    currentTheme?: Theme | ThemeData;
    themeDraft: Theme<string>[] = [];
    keysThemes: Theme<ThemesNames | string>[] = [];

    constructor() {
        if (this.api) {
            this.user = this.userService.user;
        }
    }

    async ngOnInit() {
        this.themeDraft = (await this.dbService.getLocalAllThemes()).filter(
            t => t.options.mode.replace('teams', 'default') === this.options().mode.replace('teams', 'default'),
        );
    }

    keyUpdate(value: string) {
        value = value.toLocaleLowerCase();
        // TODO
        this.keysThemes = [
            ...this.themes().filter(e => this.translate.translate(e.name).toLocaleLowerCase().includes(value)),
            ...this.themeDraft.filter(e => e.name.toLocaleLowerCase().includes(value)),
            ...(this.user?.themes
                ?.filter(e => e.name.toLocaleLowerCase().includes(value))
                ?.map<Theme<string>>(theme => ({ id: theme.themeId, name: theme.name, options: theme.data.options })) ??
                []),
        ];
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
            if ((this.currentTheme as ThemeData).data) {
                this.change.emit({
                    id: (this.currentTheme as ThemeData).themeId,
                    name: (this.currentTheme as ThemeData).name,
                    options: (this.currentTheme as ThemeData).data.options,
                });
            } else {
                this.change.emit(this.currentTheme as Theme);
            }
        }
        this.cancel();
    }
}
