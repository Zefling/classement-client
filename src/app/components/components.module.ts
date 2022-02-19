import { NgModule } from '@angular/core';

import { DialogComponent } from './dialog.component';

import { SharedModule } from '../share.module';


@NgModule({
    declarations: [DialogComponent],
    exports: [DialogComponent],
    imports: [SharedModule],
})
export class ComponentsModule {}
