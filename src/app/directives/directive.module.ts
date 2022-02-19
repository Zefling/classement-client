import { NgModule } from '@angular/core';

import { DropImageDirective } from './drop-image.directive';


@NgModule({
    declarations: [DropImageDirective],
    exports: [DropImageDirective],
})
export class DirectiveModule {}
