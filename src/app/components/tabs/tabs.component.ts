import { AfterContentInit, ChangeDetectionStrategy, Component, contentChildren, output } from '@angular/core';

import { TabContentComponent } from './tab-content.component';
import { TabTitleComponent } from './tab-title.component';

@Component({
    selector: 'tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent implements AfterContentInit {
    // contentChildren

    readonly titles = contentChildren(TabTitleComponent);
    readonly content = contentChildren(TabContentComponent);

    // output

    readonly tabChange = output<string>();

    ngAfterContentInit(): void {
        if (this.titles()?.length) {
            const ids: Record<string, boolean> = {};
            let selected = false;
            this.titles().forEach(e => {
                const id = e.id();
                if (id) {
                    ids[id] = e.selected();
                    if (ids[id]) {
                        selected = true;
                    }
                }
            });
            if (!selected) {
                const first = this.titles()[0];
                first.selected.set(true);
                ids[first.id()!] = true;
            }

            this.content()!.forEach(e => {
                const id = e.id();
                if (id) {
                    e.selected.set(ids[id]);
                }
            });
        }
    }

    update(id: string, emit: boolean = true) {
        this.titles()?.forEach(e => {
            if (e.id()) {
                e.selected.set(e.id() === id);
            }
        });
        this.ngAfterContentInit();
        if (emit) {
            this.tabChange.emit(id);
        }
    }
}
