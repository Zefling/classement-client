import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    inject,
    input,
    output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MagmaInput, MagmaInputElement, MagmaInputSelect, MagmaInputText, Subscriptions } from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { Select2Data } from 'ng-select2-component';

import { listModes } from '../../content/classement/classement-default';
import { CategoriesService } from '../../services/categories.service';

export type SearchFormFields = { searchKey: string; category: string; mode: string };

@Component({
    selector: 'search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass, FormsModule, TranslocoPipe, MagmaInput, MagmaInputElement, MagmaInputText, MagmaInputSelect],
})
export class SearchBarComponent implements OnChanges, OnDestroy {
    private readonly categories = inject(CategoriesService);

    data = input<SearchFormFields>();

    search = output<SearchFormFields>();

    categoriesList?: Select2Data;
    categoriesType?: Select2Data;

    listMode: Select2Data = [{ label: '', value: '' }, ...listModes];

    searchKey: string = '';
    category: string = '';
    mode: string = '';

    private _sub = Subscriptions.instance();

    constructor() {
        this._sub.push(
            this.categories.onChange.subscribe(() => {
                this.categoryUpdate();
            }),
        );

        this.categoryUpdate();
    }

    submit() {
        this.search.emit({ searchKey: this.searchKey, category: this.category, mode: this.mode });
    }

    private categoryUpdate() {
        this.categoriesList = [{ value: '', label: '\u00a0' }, ...this.categories.categoriesList];
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data']) {
            const current = changes['data'].currentValue as SearchFormFields;
            this.searchKey = current.searchKey;
            this.category = current.category;
            this.mode = current.mode;
        }
    }

    ngOnDestroy(): void {
        this._sub.clear();
    }
}
