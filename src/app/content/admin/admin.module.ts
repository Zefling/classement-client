import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin.routing';

@NgModule({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AdminRoutingModule],
})
export class AdminModule {}
