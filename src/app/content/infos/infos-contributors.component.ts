import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

import { MagmaLoader, MagmaLoaderMessage, MagmaSpinner, Subscriptions } from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { MarkdownComponent } from 'ngx-markdown';

import { GlobalService } from '../../services/global.service';

@Component({
    selector: 'infos-contributors',
    templateUrl: './infos-contributors.component.html',
    styleUrls: ['./infos-contributors.component.scss'],

    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslocoPipe, MarkdownComponent, MagmaLoader, MagmaLoaderMessage, MagmaSpinner],
})
export class InfoContributorsComponent {
    private readonly http = inject(HttpClient);
    private readonly global = inject(GlobalService);
    private readonly translate = inject(TranslocoService);
    private readonly cd = inject(ChangeDetectorRef);

    data!: string;
    loading = false;

    private listener = Subscriptions.instance();

    constructor() {
        if (this.global.contributors) {
            this.data = this.global.contributors;
        } else {
            this.loading = true;
            this.http.get('./CONTRIBUTORS.md', { responseType: 'text' }).subscribe(data => {
                this.data = this.global.contributors = data;
                this.loading = false;
                this.cd.markForCheck();
            });
        }
        this.listener.push(
            this.translate.langChanges$.subscribe(() => {
                this.updateTitle();
            }),
        );
    }

    updateTitle() {
        this.global.setTitle('infos.contributors');
    }
}
