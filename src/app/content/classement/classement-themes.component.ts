import { Component, inject, input, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { TabContentComponent } from 'src/app/components/tabs/tab-content.component';
import { TabTitleComponent } from 'src/app/components/tabs/tab-title.component';
import { TabsComponent } from 'src/app/components/tabs/tabs.component';
import { NgModelChangeDebouncedDirective } from 'src/app/directives/ng-model-change-debounced.directive';
import { Options, Theme, ThemeData, ThemesNames, User } from 'src/app/interface/interface';
import { APIThemeService } from 'src/app/services/api.theme.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { environment } from 'src/environments/environment';

import { themes, themesAxis, themesBingo, themesIceberg, themesList, themesLists } from './classement-default';

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
        NgModelChangeDebouncedDirective,
    ],
})
export class ClassementThemesComponent {
    // inject

    private readonly dbService = inject(DBService);
    private readonly themeService = inject(APIThemeService);
    private readonly userService = inject(APIUserService);
    private readonly translate = inject(TranslocoService);

    // input

    readonly options = input.required<Options>();

    // output

    readonly change = output<Theme | Theme<string>>();

    // viewChild

    readonly dialog = viewChild.required<DialogComponent>(DialogComponent);

    // template

    api = environment.api?.active || false;

    key?: string;

    themes!: Theme[];
    themesList: ThemesNames[] = themes;

    user?: User;
    usersThemes?: ThemeData[];

    currentTheme?: Theme;
    themeDraft: Theme<string>[] = [];
    keysThemes: Theme<ThemesNames | string>[] = [];

    async open() {
        this.dialog().open();

        const options = this.options();
        const mode = options.mode ?? 'default';

        switch (mode) {
            case 'iceberg':
                this.themesList = themesIceberg;
                break;
            case 'axis':
                this.themesList = themesAxis;
                break;
            case 'bingo':
                this.themesList = themesBingo;
                break;
            default:
                this.themesList = themesLists;
                break;
        }

        this.themes = themesList.filter(e => this.themesList.includes(e.name));

        if (this.api) {
            this.user = this.userService.user;
            this.themeService
                .getThemesByCriterion({
                    user: this.user?.id,
                    mode: this.options().mode,
                })
                .then(result => {
                    this.usersThemes = result.list;
                });
        }

        this.themeDraft = (await this.dbService.getLocalAllThemes()).filter(
            t =>
                t.options.mode.replace(/teams|columns/, 'default') ===
                this.options().mode.replace(/teams|columns/, 'default'),
        );
    }

    keyUpdate(value: string) {
        value = value.toLocaleLowerCase();
        this.keysThemes = [
            ...this.themes.filter(e => this.translate.translate(e.name).toLocaleLowerCase().includes(value)),
            ...this.themeDraft.filter(e => e.name.toLocaleLowerCase().includes(value)),
            ...(this.user?.themes
                ?.filter(e => e.name.toLocaleLowerCase().includes(value))
                ?.map<Theme<string>>(theme => ({
                    id: theme.themeId!,
                    name: theme.name,
                    options: theme.data.options,
                    source: 'user',
                })) ?? []),
        ];

        if (this.api) {
            this.themeService
                .getThemesByCriterion({
                    user: this.user?.id,
                    mode: this.options().mode,
                    size: 25 - this.keysThemes.length,
                })
                .then(result => {
                    this.keysThemes?.push(
                        ...result.list.map<Theme<string>>(theme => ({
                            id: theme.themeId!,
                            name: theme.name,
                            options: theme.data.options,
                            source: 'other',
                        })),
                    );
                });
        }
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
            this.change.emit(this.currentTheme as Theme);
        }
        this.cancel();
    }
}
