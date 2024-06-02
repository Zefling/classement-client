import { NgModule } from '@angular/core';

import { FileSizePipe } from './file-size';
import { NumFormatPipe } from './num-format';

@NgModule({
    declarations: [NumFormatPipe, FileSizePipe],
    exports: [NumFormatPipe, FileSizePipe],
    imports: [],
})
export class PipesModule {}
