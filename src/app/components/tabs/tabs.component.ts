import { Component, ContentChildren, DoCheck, QueryList } from '@angular/core';

import { TabTitleComponent } from './tab-content.component';
import { TabContentComponent } from './tab-title.component';


@Component({
    selector: 'tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements DoCheck {
    @ContentChildren(TabTitleComponent) titles?: QueryList<TabTitleComponent>;
    @ContentChildren(TabContentComponent) content?: QueryList<TabContentComponent>;

    ngAfterContentChecked(): void {}

    ngAfterContentInit(): void {
        if (this.titles?.length) {
            const ids: { [key: string]: boolean } = {};
            let selected = false;
            this.titles.forEach(e => {
                if (e.id) {
                    ids[e.id!] = !!e.selected;
                    if (!!e.selected) {
                        selected = true;
                    }
                }
            });
            if (!selected) {
                const first = this.titles.first;
                first.selected = true;
                ids[first.id!] = true;
            }

            this.content!.forEach(e => {
                if (e.id) {
                    e.selected = ids[e.id];
                }
            });
        }
    }

    ngDoCheck(): void {}

    update(id: string) {
        console.log('test', id);
        this.titles?.forEach(e => {
            if (e.id) {
                e.selected = e.id == id;
            }
        });
        this.ngAfterContentInit();
    }
}
