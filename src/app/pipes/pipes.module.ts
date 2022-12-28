import { NgModule } from '@angular/core';

import { FilesizePipe } from './file-size';
import { NumFormatPipe } from './num-format';

@NgModule({
    declarations: [NumFormatPipe, FilesizePipe],
    exports: [NumFormatPipe, FilesizePipe],
    imports: [],
})
export class PipesModule {}
