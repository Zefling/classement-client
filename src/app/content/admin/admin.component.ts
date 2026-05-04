import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { TranslocoPipe } from '@jsverse/transloco';

@Component({
    selector: 'admin-page',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],

    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslocoPipe],
})
export class AdminComponent {}
