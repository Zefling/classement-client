import { NgModule } from '@angular/core';

import { DialogComponent } from './dialog.component';
import { InfoMessageComponent } from './info-message.component';
import { InfoMessagesComponent } from './info-messages.component';
import { LightDarkComponent } from './light-dark.component';
import { ThemeIconComponent } from './theme-icon.component';

import { SharedModule } from '../share.module';


@NgModule({
    declarations: [
        DialogComponent,
        LightDarkComponent,
        InfoMessagesComponent,
        InfoMessageComponent,
        ThemeIconComponent,
    ],
    exports: [DialogComponent, LightDarkComponent, InfoMessagesComponent, InfoMessageComponent, ThemeIconComponent],
    imports: [SharedModule],
})
export class ComponentsModule {}
