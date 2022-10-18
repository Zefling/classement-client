import { NgModule } from '@angular/core';

import { DropImageDirective } from './drop-image.directive';
import { NgInitDirective } from './ngInit.directive';
import { TextareaAutosizeDirective } from './textarea-autosize.directive';
import { TooltipDirective } from './tooltip.directive';


@NgModule({
    declarations: [DropImageDirective, TextareaAutosizeDirective, TooltipDirective, NgInitDirective],
    exports: [DropImageDirective, TextareaAutosizeDirective, TooltipDirective, NgInitDirective],
})
export class DirectiveModule {}
