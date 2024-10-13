import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TranslocoModule } from '@jsverse/transloco';

import { Select2Module } from 'ng-select2-component';
import { MarkdownModule } from 'ngx-markdown';

import { DialogComponent } from './dialog/dialog.component';
import { ImportJsonComponent } from './import-json/import-json.component';
import { InfoMessageComponent } from './info-messages/info-message.component';
import { InfoMessagesComponent } from './info-messages/info-messages.component';
import { LightDarkComponent } from './light-dark/light-dark.component';
import { LoaderItemComponent } from './loader/loader-item.component';
import { LoaderComponent } from './loader/loader.component';
import { LoadingComponent } from './loader/loading.component';
import { NgxMoveableComponent } from './moveable/moveable.component';
import { NavigateResultComponent } from './navigate-result/navigate-result.component';
import { PaginationComponent } from './paginate/paginate.component';
import { PreferencesDialogComponent } from './preferences/preferences.component';
import { SeeClassementComponent } from './see-classement/see-classement.component';
import { TabContentComponent } from './tabs/tab-content.component';
import { TabTitleComponent } from './tabs/tab-title.component';
import { TabsComponent } from './tabs/tabs.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { ThemeIconComponent } from './theme-icon/theme-icon.component';
import { ZoneAreaComponent } from './zone-area/zone-area.component';
import { ZoneAxisComponent } from './zone-axis/zone-axis.component';

import { DirectiveModule } from '../directives/directive.module';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
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
        TagListComponent,
        ZoneAreaComponent,
        ZoneAxisComponent,
        PreferencesDialogComponent,
        NgxMoveableComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        PipesModule,
        DirectiveModule,
        RouterModule,
        TranslocoModule,
        MarkdownModule,
        Select2Module,
        DragDropModule,
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
        TagListComponent,
        ZoneAreaComponent,
        ZoneAxisComponent,
        PreferencesDialogComponent,
        NgxMoveableComponent,
    ],
})
export class ComponentsModule {}
