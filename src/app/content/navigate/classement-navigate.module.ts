import { NgModule } from '@angular/core';

import { ClassementNavigateRoutingModule } from './classement-navigate.routing';

@NgModule({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ClassementNavigateRoutingModule],
})
export class ClassementNavigateModule {}
