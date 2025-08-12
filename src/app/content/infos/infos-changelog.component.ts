import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { MarkdownComponent } from 'ngx-markdown';

import { GlobalService } from 'src/app/services/global.service';
import { Subscriptions } from 'src/app/tools/subscriptions';

@Component({
    selector: 'infos-changelog',
    templateUrl: './infos-changelog.component.html',
    styleUrls: ['./infos-changelog.component.scss'],
    imports: [TranslocoPipe, MarkdownComponent],
})
export class InfoChangelogComponent {
    private readonly http = inject(HttpClient);
    private readonly global = inject(GlobalService);
    private readonly translate = inject(TranslocoService);

    data!: string;

    private listener = Subscriptions.instance();

    constructor() {
        if (this.global.changelog) {
            this.data = this.global.changelog;
        } else {
            this.http.get('./CHANGELOG.md', { responseType: 'text' }).subscribe(data => {
                this.data = this.global.changelog = data
                    .replaceAll('### ', '#### ')
                    .replaceAll('# Changelog -', '### Changelog -');
            });
        }
        this.listener.push(
            this.translate.langChanges$.subscribe(() => {
                this.updateTitle();
            }),
        );
    }

    updateTitle() {
        this.global.setTitle('infos.changelog');
    }
}
