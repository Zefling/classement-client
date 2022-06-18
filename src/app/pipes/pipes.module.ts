import { NgModule } from '@angular/core';

import { NumFormatPipe } from './numFormat';


@NgModule({
    declarations: [NumFormatPipe],
    exports: [NumFormatPipe],
    imports: [],
})
export class PipesModule {}
