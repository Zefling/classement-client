import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { DialogComponent } from './dialog.component';
import { ImportJsonComponent } from './import-json.component';
import { InfoMessageComponent } from './info-message.component';
import { InfoMessagesComponent } from './info-messages.component';
import { LightDarkComponent } from './light-dark.component';
import { LoaderComponent } from './loader.component';
import { LoadingComponent } from './loading.component';
import { PaginationComponent } from './paginate.component';
import { SeeClassementComponent } from './see-classement.component';
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
        LoaderComponent,
        PaginationComponent,
        SeeClassementComponent,
    ],
    exports: [
        DialogComponent,
        LightDarkComponent,
        InfoMessagesComponent,
        InfoMessageComponent,
        ThemeIconComponent,
        ImportJsonComponent,
        LoadingComponent,
        LoaderComponent,
        PaginationComponent,
        SeeClassementComponent,
    ],
    imports: [CommonModule, RouterModule, TranslateModule],
})
export class ComponentsModule {}
