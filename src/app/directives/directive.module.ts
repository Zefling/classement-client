import { NgModule } from '@angular/core';

import { DropImageDirective } from './drop-image.directive';
import { TextareaAutosizeDirective } from './textarea-autosize.directive';


@NgModule({
    declarations: [DropImageDirective, TextareaAutosizeDirective],
    exports: [DropImageDirective, TextareaAutosizeDirective],
})
export class DirectiveModule {}
