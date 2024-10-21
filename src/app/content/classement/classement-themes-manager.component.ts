import { Component, OnInit, inject, input, model, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MessageService } from 'src/app/components/info-messages/info-messages.component';
import { TabContentComponent } from 'src/app/components/tabs/tab-content.component';
import { TabTitleComponent } from 'src/app/components/tabs/tab-title.component';
import { TabsComponent } from 'src/app/components/tabs/tabs.component';
import { ThemeIconComponent } from 'src/app/components/theme-icon/theme-icon.component';
import { Options, Theme, User } from 'src/app/interface/interface';
import { APIThemeService } from 'src/app/services/api.theme.service';
import { APIUserService } from 'src/app/services/api.user.service';
import { DBService } from 'src/app/services/db.service';
import { Utils } from 'src/app/tools/utils';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'classement-themes-manager',
    templateUrl: './classement-themes-manager.component.html',
    styleUrls: ['./classement-themes-manager.component.scss'],
    standalone: true,
    imports: [
        // modules
        FormsModule,
        TranslocoModule,

        // components
        DialogComponent,
        TabsComponent,
        TabContentComponent,
        TabTitleComponent,
        ThemeIconComponent,
    ],
})
export class ClassementThemesManagerComponent implements OnInit {
    // inject

    private readonly dbService = inject(DBService);
    private readonly messageService = inject(MessageService);
    private readonly userService = inject(APIUserService);
    private readonly themeService = inject(APIThemeService);
    private readonly translate = inject(TranslocoService);

    // input / model

    options = model.required<Options>();
    themeCurrent = input<Theme<string>>();

    // viewChild

    exportDialog = viewChild.required<DialogComponent>('exportDialog');

    // template

    api = environment.api?.active || false;

    user?: User;

    themeId = '';
    themeName = '';
    saveMode?: 'browser' | 'server' = 'browser';
    deleteMode?: 'browser' | 'server' = 'browser';
    saveVisibility?: 'public' | 'private' = 'public';

    themeBrowser: Theme<string>[] = [];
    themeServer: Theme<string>[] = [];
    selectedTheme?: Theme<string>;

    constructor() {
        if (this.api) {
            this.user = this.userService.user;
        }
    }

    ngOnInit(): void {
        if (this.api) {
            this.user = this.userService.user;
        }
    }

    selectTheme(theme: Theme<string>) {
        this.selectedTheme = theme;
        this.saveVisibility = theme.hidden ? 'private' : 'public';
    }

    private optionToTheme(themeCurrent?: Theme<string>) {
        const theme: Theme<string> = {
            id: '',
            name: this.themeName.trim() || themeCurrent?.name || '',
            options: this.options(),
            source: 'local',
        };
        theme.options.themeName = this.themeName.trim() || themeCurrent?.name || '';

        // usage
        delete (theme.options as any)['showAdvancedOptions']; // removed option
        delete theme.options['autoSave'];
        delete theme.options['streamMode'];
        // infos
        delete (theme.options as any)['title'];
        delete (theme.options as any)['category'];
        delete (theme.options as any)['description'];
        delete (theme.options as any)['tags'];

        return theme;
    }

    async exportDialogOpen() {
        this.exportDialog().open();
        this.themeBrowser = (await this.dbService.getLocalAllThemes()).filter(
            t => t.options.mode.replace('teams', 'default') === this.options().mode.replace('teams', 'default'),
        );
        if (this.api) {
            this.themeServer =
                this.userService.user?.themes?.map<Theme<string>>(theme => ({
                    id: theme.themeId!,
                    name: theme.name,
                    options: theme.data.options,
                    hidden: theme.hidden,
                    source: 'user',
                })) || [];
        }
    }

    async saveBrowser() {
        const theme = await this.dbService.saveLocalTheme(this.optionToTheme(this.themeCurrent()));
        this.themeId = theme.id;
        this.exportDialog().close();
        this.messageService.addMessage(this.translate.translate('generator.theme.browser.save.success'));
    }

    async updateBrowser() {
        if (this.themeName.trim()) {
            this.selectedTheme!.name = this.themeName;
        }
        this.selectedTheme!.options = this.options();
        await this.dbService.saveLocalTheme(this.selectedTheme!);
        this.exportDialog().close();
        this.messageService.addMessage(this.translate.translate('generator.theme.browser.update.success'));
    }

    async removeBrowser() {
        await this.dbService.deleteLocalTheme(this.selectedTheme!.id);
        this.themeBrowser.splice(this.themeBrowser.indexOf(this.selectedTheme!), 1);
        this.exportDialog().close();
        this.messageService.addMessage(this.translate.translate('generator.theme.browser.delete.success'));
    }

    async saveServer() {
        let theme = this.optionToTheme();
        theme.hidden = this.saveVisibility === 'private';
        delete theme.source;
        const data = await this.themeService.saveTheme(theme);
        this.user!.themes?.push(data);
        this.themeId = theme.id;
        this.exportDialog().close();
        this.messageService.addMessage(this.translate.translate('generator.theme.account.save.success'));
        this.themeName = '';
        this.selectedTheme = undefined;
    }

    async updateServer() {
        let theme = this.optionToTheme(this.selectedTheme);
        theme.hidden = this.saveVisibility === 'private';
        delete theme.source;
        const index = this.user?.themes?.findIndex(e => e.themeId === this.selectedTheme!.id)!;
        const data = await this.themeService.saveTheme(theme, this.selectedTheme!.id);
        this.user!.themes![index] = data;
        this.themeId = theme.id;
        this.exportDialog().close();
        this.messageService.addMessage(this.translate.translate('generator.theme.account.update.success'));
        this.themeName = '';
        this.selectedTheme = undefined;
    }

    async removeServer() {
        await this.themeService.deleteTheme(this.selectedTheme!.id);
        this.user!.themes!.splice(this.user?.themes?.findIndex(e => e.themeId === this.selectedTheme!.id)!, 1);
        this.exportDialog().close();
        this.messageService.addMessage(this.translate.translate('generator.theme.browser.delete.success'));
    }

    export() {
        const theme = this.optionToTheme();

        Utils.downloadFile(
            JSON.stringify(theme),
            Utils.normalizeFileName(`theme-${theme.options.mode}-${this.themeName}`) + '.json',
            'text/plain',
        );
        this.exportCancel();
    }

    exportCancel() {
        this.themeName = '';
        this.selectedTheme = undefined;
        this.exportDialog().close();
    }
}