import { NgModule } from '@angular/core';

import { ContextMenuDirective } from './context-menu.directive';
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
        ContextMenuDirective,
    ],
    exports: [
        DropImageDirective,
        TextareaAutosizeDirective,
        TooltipDirective,
        NgInitDirective,
        Sortable,
        RemoveTileDirective,
        ContextMenuDirective,
    ],
})
export class DirectiveModule {}
