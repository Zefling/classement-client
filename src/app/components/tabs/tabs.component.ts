import { AfterContentInit, Component, contentChildren, output } from '@angular/core';

import { TabTitleComponent } from './tab-content.component';
import { TabContentComponent } from './tab-title.component';

@Component({
    selector: 'tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements AfterContentInit {
    titles = contentChildren(TabTitleComponent);
    content = contentChildren(TabContentComponent);

    tabChange = output<string>();

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
            if (e.id) {
                e.selected.set(e.id() === id);
            }
        });
        this.ngAfterContentInit();
        if (emit) {
            this.tabChange.emit(id);
        }
    }
}
