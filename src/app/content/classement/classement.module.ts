import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';

import { ImageCropperModule } from 'ngx-image-cropper';

import { SharedModule } from 'src/app/share.module';

import { ClassementEditComponent } from './classement-edit.component';
import { ClassementOptimiseComponent } from './classement-optimise.component';
import { ClassementOptionsComponent } from './classement-options.component';
import { ClassementSaveServerComponent } from './classement-save-server.component';
import { ClassemenThemesComponent } from './classement-themes.component';
import { ClassementRoutingModule } from './classement.routing';


@NgModule({
    declarations: [
        // page
        ClassementOptionsComponent,
        ClassemenThemesComponent,
        ClassementEditComponent,
        ClassementOptimiseComponent,
        ClassementSaveServerComponent,
    ],
    imports: [SharedModule, DragDropModule, ImageCropperModule, ClassementRoutingModule],
    providers: [],
    exports: [],
})
export class ClassementModule {}
