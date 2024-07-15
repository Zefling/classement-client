import {
    Directive,
    Host,
    HostBinding,
    HostListener,
    input,
    OnChanges,
    OnDestroy,
    OnInit,
    Renderer2,
    SimpleChanges,
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Utils } from '../tools/utils';

export type SortRule =
    | { type: 'string' | 'number' | 'date'; attr: string; init?: 'asc' | 'desc' }
    | { type: 'translate'; attr: string; translate: string; init?: 'asc' | 'desc'; default?: string }
    | { type: 'none' };

@Directive({
    selector: '[sort-rule]',
})
export class SortRuleDirective implements OnInit {
    sortRule = input<SortRule | undefined>(undefined, { alias: 'sort-rule' });

    @HostBinding('class.sort-asc')
    get classSortAsc() {
        return this.sortable?.currentRuleOrder === true && this.sortable?.currentRule === this.sortRule();
    }

    @HostBinding('class.sort-desc')
    get classSortDesc() {
        return this.sortable?.currentRuleOrder === false && this.sortable?.currentRule === this.sortRule();
    }

    @HostBinding('class.sort-cell')
    get classSortCell() {
        return this.sortRule()?.type !== 'none';
    }

    sortOrder?: { order: boolean; rule?: SortRule };

    constructor(@Host() private sortable: SortableDirective) {}

    ngOnInit(): void {
        const sortRule = this.sortRule();
        if (sortRule && sortRule.type !== 'none' && sortRule.init) {
            this.sortable.sortWithRule(sortRule, sortRule.init);
        }
    }

    @HostListener('click')
    onClick() {
        this.sortable.sortWithRule(this.sortRule());
    }
}

@Directive({
    selector: '[sortable]',
})
export class SortableDirective implements OnInit, OnChanges, OnDestroy {
    sortable = input<any[] | undefined>([]);

    sortableFilterInput = input<HTMLInputElement | undefined>(undefined, { alias: 'sortable-filter-input' });

    sortableFilter = input<((key: string, item: any, index: number) => boolean) | undefined>(undefined, {
        alias: 'sortable-filter',
    });

    currentRule?: SortRule;
    currentRuleOrder = false;

    private sortableComplete: any[] = [];
    private inputListener?: () => void;
    private input = '';

    constructor(
        private readonly translate: TranslateService,
        private readonly renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        if (this.sortableFilterInput()) {
            this.inputListener = this.renderer.listen(this.sortableFilterInput(), 'input', (inputEvent: InputEvent) => {
                this.filter((inputEvent.target as HTMLInputElement).value);
            });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['sortable'] && this.sortableFilterInput() && this.sortable()) {
            this.sortableComplete.splice(0, this.sortable.length);
            this.sortableComplete.push(...(this.sortable() || []));
            this.update();
        }
    }

    update() {
        this.filter(this.sortableFilterInput()?.value || '');
    }

    ngOnDestroy(): void {
        this.inputListener?.();
    }

    sortWithRule(rule?: SortRule, order: 'asc' | 'desc' = 'asc') {
        if (this.currentRule === rule) {
            this.currentRuleOrder = !this.currentRuleOrder;
        } else {
            this.currentRule = rule;
            this.currentRuleOrder = order === 'asc';
        }

        this.sortLines();
    }

    sortLines() {
        const rule = this.currentRule;
        const sortable = this.sortable();
        if (rule && rule.type !== 'none' && Array.isArray(sortable) && sortable.length > 1) {
            sortable.sort((a, b) => {
                let valA;
                let valB;
                for (const attr of rule.attr.split(',')) {
                    valA ??= Utils.getNestedValue(a, attr);
                    valB ??= Utils.getNestedValue(b, attr);
                }

                let test = 0;
                if (rule.type === 'string') {
                    test = (valA as string).localeCompare(valB as string);
                } else if (rule.type === 'translate') {
                    test = this.translate
                        .instant(rule.translate.replace('%value%', valA || rule.default))
                        .localeCompare(this.translate.instant(rule.translate.replace('%value%', valB || rule.default)));
                } else if (rule.type === 'number') {
                    test = valA - valB;
                } else if (rule.type === 'date') {
                    test = new Date(valA).getTime() - new Date(valB).getTime();
                }

                return test * (this.currentRuleOrder ? 1 : -1);
            });
        }
    }

    private filter(input: string = '') {
        const sortable = this.sortable();
        if (this.input !== input && sortable && this.sortableComplete?.length && this.sortableFilter()) {
            sortable.splice(0, sortable.length);
            const result = !!input?.trim()
                ? this.sortableComplete.filter((item, index) => this.sortableFilter()!(input, item, index))
                : this.sortableComplete;
            sortable.push(...result);
            this.sortLines();
            this.input = input;
        }
    }
}

export const Sortable = [SortableDirective, SortRuleDirective];
