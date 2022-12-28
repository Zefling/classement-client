import {
    Directive,
    Host,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Renderer2,
    SimpleChanges,
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

export type SortRule =
    | { type: 'string' | 'number' | 'date'; attr: string; init?: 'asc' | 'desc' }
    | { type: 'translate'; attr: string; translate: string; init?: 'asc' | 'desc' }
    | { type: 'none' };

@Directive({
    selector: '[sort-rule]',
})
export class SortRuleDirective implements OnInit {
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

    ngOnInit(): void {
        if (this.sortRule && this.sortRule.type !== 'none' && this.sortRule.init) {
            this.sortable.sortWithRule(this.sortRule, this.sortRule.init);
        }
    }

    @HostListener('click')
    onClick() {
        this.sortable.sortWithRule(this.sortRule);
    }
}

@Directive({
    selector: '[sortable]',
})
export class SortableDirective implements OnInit, OnChanges, OnDestroy {
    @Input()
    sortable?: any[] = [];

    @Input('sortable-filter-input')
    sortableFilterInput?: HTMLInputElement;

    @Input('sortable-filter')
    sortableFilter?: (key: string, item: any, index: number) => boolean;

    currentRule?: SortRule;
    currentRuleOrder = false;

    private sortableComplete: any[] = [];
    private inputListener?: () => void;
    private input = '';

    constructor(private translate: TranslateService, private renderer: Renderer2) {}

    ngOnInit(): void {
        if (this.sortableFilterInput) {
            this.inputListener = this.renderer.listen(this.sortableFilterInput, 'input', (inputEvent: any) => {
                this.filter((inputEvent.target as HTMLInputElement).value);
            });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['sortable']) {
            if (this.sortableFilterInput && this.sortable) {
                this.sortableComplete.splice(0, this.sortable.length);
                this.sortableComplete.push(...this.sortable);
                this.filter(this.sortableFilterInput?.value || '');
            }
        }
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
    }

    private filter(input: string = '') {
        if (this.input !== input && this.sortable && this.sortableComplete && this.sortableFilter) {
            this.sortable.splice(0, this.sortable.length);
            const result = !!input?.trim()
                ? this.sortableComplete.filter((item, index) => this.sortableFilter!(input, item, index))
                : this.sortableComplete;
            this.sortable.push(...result);
            this.sortLines();
            this.input = input;
        }
    }
}

export const Sortable = [SortableDirective, SortRuleDirective];
