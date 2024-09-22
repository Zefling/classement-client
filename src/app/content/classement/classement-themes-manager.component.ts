import { Component, inject, input, model, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslocoModule } from '@jsverse/transloco';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MessageService } from 'src/app/components/info-messages/info-messages.component';
import { TabTitleComponent } from 'src/app/components/tabs/tab-content.component';
import { TabContentComponent } from 'src/app/components/tabs/tab-title.component';
import { TabsComponent } from 'src/app/components/tabs/tabs.component';
import { ThemeIconComponent } from 'src/app/components/theme-icon/theme-icon.component';
import { Options, Theme } from 'src/app/interface/interface';
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
export class ClassementThemesManagerComponent {
    // inject

    private readonly dbService = inject(DBService);
    private readonly messageService = inject(MessageService);

    // input / model

    options = model.required<Options>();
    themeCurrent = input<Theme<string>>();

    // viewChild

    exportDialog = viewChild.required<DialogComponent>('exportDialog');

    // template

    api = environment.api?.active || false;

    themeId = '';
    themeName = '';

    themeBrowser: Theme<string>[] = [];
    themeServer: Theme<string>[] = [];
    selectedTheme?: Theme<string>;

    selectTheme(theme: Theme<string>) {
        this.selectedTheme = theme;
    }

    private optionToTheme(id: string = this.themeId) {
        const theme: Theme<string> = {
            id,
            name: this.themeName,
            options: this.options(),
        };

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
    }

    async saveBrowser() {
        const theme = await this.dbService.saveLocalTheme(this.optionToTheme(''));
        this.themeId = theme.id;
        this.exportDialog().close();
        this.messageService.addMessage('Brouillon sauvegardé');
    }

    async updateBrowser() {
        this.selectedTheme!.options = this.options();
        await this.dbService.saveLocalTheme(this.selectedTheme!);
        this.exportDialog().close();
        this.messageService.addMessage('Brouillon mise à jour');
    }

    async removeBrowser() {
        await this.dbService.deleteLocalTheme(this.selectedTheme!.id);
        this.themeBrowser.splice(this.themeBrowser.indexOf(this.selectedTheme!), 1);
        this.exportDialog().close();
        this.messageService.addMessage('Brouillon supprimé');
    }

    saveServer() {}

    updateServer() {}

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
