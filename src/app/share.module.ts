import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslocoModule } from '@jsverse/transloco';

import { Select2Module } from 'ng-select2-component';

import { ComponentsModule } from './components/components.module';
import { DirectiveModule } from './directives/directive.module';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
    exports: [
        // external
        CommonModule,
        TranslocoModule,
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
        TranslocoModule,
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
