import { ChangeDetectorRef, Directive, Host, HostBinding, HostListener, Input } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';


export type SortRule =
    | { type: 'string' | 'number' | 'date'; attr: string }
    | { type: 'translate'; attr: string; translate: string }
    | { type: 'none' };

@Directive({
    selector: '[sort-rule]',
})
export class SortRuleDirective {
    @Input('sort-rule')
    sortRule?: SortRule;

    @HostBinding('class.sort-asc')
    get classSortAsc() {
        return this.sortable?.currentRuleOrder === true && this.sortable?.currentRule === this.sortRule;
    }

    @HostBinding('class.sort-desc')
    get classSortDesc() {
        return this.sortable?.currentRuleOrder === false && this.sortable?.currentRule === this.sortRule;
    }

    @HostBinding('class.sort-cell')
    get classSortCell() {
        return this.sortRule?.type !== 'none';
    }

    sortOrder?: { order: boolean; rule?: SortRule };

    constructor(@Host() private sortable: SortableDirective) {}

    @HostListener('click')
    onClick() {
        this.sortable.sort(this.sortRule);
    }
}

@Directive({
    selector: '[sortable]',
})
export class SortableDirective {
    @Input()
    sortable?: any[] = [];

    currentRule?: SortRule;
    currentRuleOrder = false;

    constructor(private translate: TranslateService, private cd: ChangeDetectorRef) {}

    sort(rule?: SortRule): { order: boolean; rule?: SortRule } {
        // change of reinit order if different
        if (this.currentRule === rule) {
            this.currentRuleOrder = !this.currentRuleOrder;
        } else {
            this.currentRule = rule;
            this.currentRuleOrder = true;
        }

        // sort
        if (rule && rule.type !== 'none' && Array.isArray(this.sortable) && this.sortable.length > 1) {
            this.sortable.sort((a, b) => {
                // todo replace eval by a more secure method
                a = eval(`a['${rule.attr.replace('.', "']['")}']`);
                b = eval(`b['${rule.attr.replace('.', "']['")}']`);
                let test = 0;
                if (rule.type === 'string') {
                    test = (a as string).localeCompare(b as string);
                } else if (rule.type === 'translate') {
                    test = this.translate
                        .instant(rule.translate.replace('%value%', a))
                        .localeCompare(this.translate.instant(rule.translate.replace('%value%', b)));
                } else if (rule.type === 'number') {
                    test = a - b;
                } else if (rule.type === 'date') {
                    test = new Date(a).getTime() - new Date(b).getTime();
                }
                return test * (this.currentRuleOrder ? 1 : -1);
            });
        }

        return { order: this.currentRuleOrder, rule };
    }
}

export const Sortable = [SortableDirective, SortRuleDirective];
