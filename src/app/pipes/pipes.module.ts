import { NgModule } from '@angular/core';

import { NumFormatPipe } from './numFormat';

import { SharedModule } from '../share.module';


@NgModule({
    declarations: [NumFormatPipe],
    exports: [NumFormatPipe],
    imports: [SharedModule],
})
export class PipesModule {}
