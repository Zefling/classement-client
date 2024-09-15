import { NgModule } from '@angular/core';

import { FileSizePipe } from './file-size';
import { NumFormatPipe } from './num-format';

@NgModule({
    exports: [NumFormatPipe, FileSizePipe],
    imports: [NumFormatPipe, FileSizePipe],
})
export class PipesModule {}
