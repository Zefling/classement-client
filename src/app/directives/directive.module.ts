import { NgModule } from '@angular/core';

import { DropImageDirective } from './drop-image.directive';
import { NgInitDirective } from './ngInit.directive';
import { RemoveTileDirective } from './remove-tile.directive';
import { Sortable } from './sortable.directive';
import { TextareaAutosizeDirective } from './textarea-autosize.directive';
import { TooltipDirective } from './tooltip.directive';

@NgModule({
    declarations: [
        DropImageDirective,
        TextareaAutosizeDirective,
        TooltipDirective,
        NgInitDirective,
        Sortable,
        RemoveTileDirective,
    ],
    exports: [
        DropImageDirective,
        TextareaAutosizeDirective,
        TooltipDirective,
        NgInitDirective,
        Sortable,
        RemoveTileDirective,
    ],
})
export class DirectiveModule {}
