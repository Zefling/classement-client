import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { ComponentsModule } from './components/components.module';
import { DirectiveModule } from './directives/directive.module';
import { PipesModule } from './pipes/pipes.module';


@NgModule({
    exports: [
        // external
        CommonModule,
        TranslateModule,
        FormsModule,
        HttpClientModule,
        // internal
        DirectiveModule,
        ComponentsModule,
        PipesModule,
    ],
    imports: [
        // external
        CommonModule,
        TranslateModule,
        FormsModule,
        HttpClientModule,
        // internal
        DirectiveModule,
        ComponentsModule,
        PipesModule,
    ],
})
export class SharedModule {}
