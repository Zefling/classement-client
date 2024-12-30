import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { TranslocoPipe } from '@jsverse/transloco';

import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'infos-page',
    templateUrl: './infos.component.html',
    styleUrls: ['./infos.component.scss'],
    imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslocoPipe],
})
export class InfosComponent {
    private readonly global = inject(GlobalService);
    modeApi = computed(() => this.global.withApi());
}
