import { NgModule } from '@angular/core';

import { ClassementListRoutingModule } from './classement-list.routing';

@NgModule({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ClassementListRoutingModule],
})
export class ClassementListModule {}
