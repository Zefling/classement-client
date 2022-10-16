import { NgModule } from '@angular/core';

import { DropImageDirective } from './drop-image.directive';
import { TextareaAutosizeDirective } from './textarea-autosize.directive';
import { TooltipDirective } from './tooltip.directive';


@NgModule({
    declarations: [DropImageDirective, TextareaAutosizeDirective, TooltipDirective],
    exports: [DropImageDirective, TextareaAutosizeDirective, TooltipDirective],
})
export class DirectiveModule {}
