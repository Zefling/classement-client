import { NgModule } from '@angular/core';

import { DialogComponent } from './dialog.component';
import { ImportJsonComponent } from './import-json.component';
import { InfoMessageComponent } from './info-message.component';
import { InfoMessagesComponent } from './info-messages.component';
import { LightDarkComponent } from './light-dark.component';
import { LoadingComponent } from './loading.component';
import { ThemeIconComponent } from './theme-icon.component';

import { SharedModule } from '../share.module';


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
    imports: [SharedModule],
})
export class ComponentsModule {}
