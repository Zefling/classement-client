import { NgModule } from '@angular/core';

import { DialogComponent } from './dialog.component';
import { LightDarkComponent } from './light-dark.component';

import { SharedModule } from '../share.module';


@NgModule({
    declarations: [DialogComponent, LightDarkComponent],
    exports: [DialogComponent, LightDarkComponent],
    imports: [SharedModule],
})
export class ComponentsModule {}
