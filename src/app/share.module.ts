import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { Select2Module } from 'ng-select2-component';

import { ComponentsModule } from './components/components.module';
import { DirectiveModule } from './directives/directive.module';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
    exports: [
        // external
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        Select2Module,
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
        ReactiveFormsModule,
        Select2Module,
        // internal
        DirectiveModule,
        ComponentsModule,
        PipesModule,
    ],
})
export class SharedModule {}
