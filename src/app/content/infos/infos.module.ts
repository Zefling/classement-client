import { NgModule } from '@angular/core';

import { InfosRoutingModule } from './infos.routing';

@NgModule({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [InfosRoutingModule],
})
export class InfosModule {}
