import { Directive, OnDestroy, inject, input, numberAttribute, output } from '@angular/core';
import { NgModel } from '@angular/forms';

import { debounceTime, distinctUntilChanged, skip } from 'rxjs';

import { Subscriptions } from '../tools/subscriptions';

@Directive({
    selector: '[ngModelChangeDebounced]',
    standalone: true,
})
export class NgModelChangeDebouncedDirective implements OnDestroy {
    private readonly ngModel = inject(NgModel);
    readonly ngModelChangeDebounceTime = input(500, { transform: numberAttribute });
    readonly ngModelChangeDebounced = output<any>();

    sub = Subscriptions.instance();

    constructor() {
        this.sub.push(
            this.ngModel.control.valueChanges
                .pipe(
                    skip(1), // skip initial value
                    distinctUntilChanged(),
                    debounceTime(this.ngModelChangeDebounceTime()),
                )
                .subscribe(value => this.ngModelChangeDebounced.emit(value)),
        );
    }

    ngOnDestroy() {
        this.sub.clear();
    }
}
