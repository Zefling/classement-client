import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Subject } from 'rxjs';

import { categories } from '../content/classement/classement-default';
import { Category } from '../interface/interface';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
    categoriesList: Category[] = [];

    onChange = new Subject<void>();

    constructor(private readonly translate: TranslateService) {
        this.translate.onLangChange.subscribe(() => {
            this.sort();
            this.onChange.next();
        });

        this.sort();
    }

    sort() {
        this.categoriesList = categories.map<Category>(category => ({
            value: category,
            label: this.translate.instant(`category.${category}`),
        }));
        this.categoriesList.sort((a, b) =>
            a.value === 'other' ? 1 : b.value === 'other' ? -1 : a.label.localeCompare(b.label),
        );
    }
}
