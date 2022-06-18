import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { DialogComponent } from './dialog.component';
import { ImportJsonComponent } from './import-json.component';
import { InfoMessageComponent } from './info-message.component';
import { InfoMessagesComponent } from './info-messages.component';
import { LightDarkComponent } from './light-dark.component';
import { LoadingComponent } from './loading.component';
import { ThemeIconComponent } from './theme-icon.component';


@NgModule({
    declarations: [
        DialogComponent,
        LightDarkComponent,
        InfoMessagesComponent,
        InfoMessageComponent,
        ThemeIconComponent,
        ImportJsonComponent,
        LoadingComponent,
    ],
    exports: [
        DialogComponent,
        LightDarkComponent,
        InfoMessagesComponent,
        InfoMessageComponent,
        ThemeIconComponent,
        ImportJsonComponent,
        LoadingComponent,
    ],
    imports: [CommonModule, TranslateModule],
})
export class ComponentsModule {}
