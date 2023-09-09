import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';

import { ImageCropperModule } from 'ngx-image-cropper';

import { SharedModule } from 'src/app/share.module';

import { ClassementEditImageComponent } from './classement-edit-image.component';
import { ClassementEditComponent } from './classement-edit.component';
import { ClassementLoginComponent } from './classement-login.component';
import { ClassementOptimiseComponent } from './classement-optimise.component';
import { ClassementOptionsComponent } from './classement-options.component';
import { ClassementSaveServerComponent } from './classement-save-server.component';
import { ClassemenThemesComponent } from './classement-themes.component';
import { ClassementRoutingModule } from './classement.routing';
import { ExternalImdbComponent } from './external.imdb.component';
import { ExternalMalComponent } from './external.mal.component';

@NgModule({
    declarations: [
        // page
        ClassementOptionsComponent,
        ClassemenThemesComponent,
        ClassementEditComponent,
        ClassementOptimiseComponent,
        ClassementSaveServerComponent,
        ClassementEditImageComponent,
        ClassementLoginComponent,
        // extension
        ExternalImdbComponent,
        ExternalMalComponent,
    ],
    imports: [SharedModule, DragDropModule, ImageCropperModule, ClassementRoutingModule],
    providers: [],
    exports: [],
})
export class ClassementModule {}
