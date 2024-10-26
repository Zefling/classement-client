import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslocoModule } from '@jsverse/transloco';

import { Select2Module } from 'ng-select2-component';

import { DialogComponent } from './components/dialog/dialog.component';
import { PreferencesDialogComponent } from './components/preferences/preferences.component';

@NgModule({
    exports: [
        // external
        CommonModule,
        TranslocoModule,
        FormsModule,
        ReactiveFormsModule,
        Select2Module,
        // internal
    ],
    imports: [
        // external
        CommonModule,
        TranslocoModule,
        FormsModule,
        ReactiveFormsModule,
        Select2Module,
        // internal
        DialogComponent,
        PreferencesDialogComponent,
    ],
})
export class SharedModule {}
