import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { TranslocoPipe } from '@jsverse/transloco';

@Component({
    selector: 'admin-page',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
    imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslocoPipe],
})
export class AdminComponent {}
