import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { DialogComponent } from './dialog/dialog.component';
import { ImportJsonComponent } from './import-json/import-json.component';
import { InfoMessageComponent } from './info-messages/info-message.component';
import { InfoMessagesComponent } from './info-messages/info-messages.component';
import { LightDarkComponent } from './light-dark/light-dark.component';
import { LoaderItemComponent } from './loader/loader-item.component';
import { LoaderComponent } from './loader/loader.component';
import { LoadingComponent } from './loader/loading.component';
import { NavigateResultComponent } from './navigate-result/navigate-result.component';
import { PaginationComponent } from './paginate/paginate.component';
import { SeeClassementComponent } from './see-classement/see-classement.component';
import { TabTitleComponent } from './tabs/tab-content.component';
import { TabContentComponent } from './tabs/tab-title.component';
import { TabsComponent } from './tabs/tabs.component';
import { ThemeIconComponent } from './theme-icon/theme-icon.component';

import { DirectiveModule } from '../directives/directive.module';
import { PipesModule } from '../pipes/pipes.module';

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
        LoaderItemComponent,
        PaginationComponent,
        SeeClassementComponent,
        TabTitleComponent,
        TabContentComponent,
        TabsComponent,
        NavigateResultComponent,
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
        LoaderItemComponent,
        PaginationComponent,
        SeeClassementComponent,
        TabTitleComponent,
        TabContentComponent,
        TabsComponent,
        NavigateResultComponent,
    ],
    imports: [CommonModule, FormsModule, PipesModule, DirectiveModule, RouterModule, TranslateModule],
})
export class ComponentsModule {}
