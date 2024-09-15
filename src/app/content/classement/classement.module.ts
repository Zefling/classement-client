import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';

import { ImageCropperComponent } from 'ngx-image-cropper';

import { CdkDragElement } from 'src/app/directives/drag-element.directive';
import { CdkDropZone } from 'src/app/directives/dropzone.directive';
import { SharedModule } from 'src/app/share.module';

import { ClassementEditImageComponent } from './classement-edit-image.component';
import { ClassementEditComponent } from './classement-edit.component';
import { ClassementLoginComponent } from './classement-login.component';
import { ClassementOptimiseComponent } from './classement-optimise.component';
import { ClassementOptionsComponent } from './classement-options.component';
import { ClassementSaveServerComponent } from './classement-save-server.component';
import { ClassementThemesComponent } from './classement-themes.component';
import { ClassementRoutingModule } from './classement.routing';
import { ExternalImdbComponent } from './external.imdb.component';

@NgModule({
    imports: [
        SharedModule,
        DragDropModule,
        ImageCropperComponent,
        ClassementRoutingModule,
        CdkDropZone,
        CdkDragElement,
        // page
        ClassementOptionsComponent,
        ClassementThemesComponent,
        ClassementEditComponent,
        ClassementOptimiseComponent,
        ClassementSaveServerComponent,
        ClassementEditImageComponent,
        ClassementLoginComponent,
        // extension
        ExternalImdbComponent,
    ],
    providers: [],
    exports: [],
})
export class ClassementModule {}
