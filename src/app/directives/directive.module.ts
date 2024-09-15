import { NgModule } from '@angular/core';

import { ClickOutsideDirective } from './click-outside.directive';
import { ContextMenuDirective } from './context-menu.directive';
import { DropImageDirective } from './drop-image.directive';
import { NgInitDirective } from './ngInit.directive';
import { RemoveTileDirective } from './remove-tile.directive';
import { Sortable } from './sortable.directive';
import { TextareaAutosizeDirective } from './textarea-autosize.directive';
import { TooltipDirective } from './tooltip.directive';

@NgModule({
    imports: [
        DropImageDirective,
        TextareaAutosizeDirective,
        TooltipDirective,
        NgInitDirective,
        Sortable,
        RemoveTileDirective,
        ContextMenuDirective,
        ClickOutsideDirective,
    ],
    exports: [
        DropImageDirective,
        TextareaAutosizeDirective,
        TooltipDirective,
        NgInitDirective,
        Sortable,
        RemoveTileDirective,
        ContextMenuDirective,
        ClickOutsideDirective,
    ],
})
export class DirectiveModule {}
