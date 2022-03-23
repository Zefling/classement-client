import { NgModule } from '@angular/core';

import { DialogComponent } from './dialog.component';
import { InfoMessageComponent } from './info-message.component';
import { InfoMessagesComponent } from './info-messages.component';
import { LightDarkComponent } from './light-dark.component';

import { SharedModule } from '../share.module';


@NgModule({
    declarations: [DialogComponent, LightDarkComponent, InfoMessagesComponent, InfoMessageComponent],
    exports: [DialogComponent, LightDarkComponent, InfoMessagesComponent, InfoMessageComponent],
    imports: [SharedModule],
})
export class ComponentsModule {}
