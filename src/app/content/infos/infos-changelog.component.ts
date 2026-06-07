import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Subscriptions } from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { MarkdownComponent } from 'ngx-markdown';

import { GlobalService } from '../../services/global.service';

@Component({
    selector: 'infos-changelog',
    templateUrl: './infos-changelog.component.html',
    styleUrls: ['./infos-changelog.component.scss'],

    changeDetection: ChangeDetectionStrategy.OnPush,
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
