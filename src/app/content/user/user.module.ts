import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user.routing';

@NgModule({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UserRoutingModule],
})
export class UserModule {}
