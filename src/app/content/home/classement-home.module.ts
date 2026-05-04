import { NgModule } from '@angular/core';

import { ClassementHomeRoutingModule } from './classement-home.routing';

@NgModule({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ClassementHomeRoutingModule],
})
export class ClassementHomeModule {}
