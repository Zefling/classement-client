import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { MarkdownComponent } from 'ngx-markdown';

import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

@Component({
    selector: 'infos-contributors',
    templateUrl: './infos-contributors.component.html',
    styleUrls: ['./infos-contributors.component.scss'],

    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslocoPipe, MarkdownComponent],
})
export class InfoContributorsComponent {
    private readonly http = inject(HttpClient);
    private readonly global = inject(GlobalService);
    private readonly translate = inject(TranslocoService);

    data!: string;

    private listener = Subscriptions.instance();

    constructor() {
        if (this.global.contributors) {
            this.data = this.global.contributors;
        } else {
            this.http.get('./CONTRIBUTORS.md', { responseType: 'text' }).subscribe(data => {
                this.data = this.global.contributors = data;
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
