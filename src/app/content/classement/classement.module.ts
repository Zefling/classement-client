import { NgModule } from '@angular/core';

import { ClassementRoutingModule } from './classement.routing';

@NgModule({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ClassementRoutingModule],
})
export class ClassementModule {}
