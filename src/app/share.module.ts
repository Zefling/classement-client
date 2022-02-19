import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    exports: [CommonModule, TranslateModule],
})
export class SharedModule {}
