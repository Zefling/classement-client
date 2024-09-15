import { Injectable, inject } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

import { Subject } from 'rxjs';

import { categories } from '../content/classement/classement-default';
import { Category } from '../interface/interface';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
    private readonly translate = inject(TranslocoService);

    categoriesList: Category[] = [];

    onChange = new Subject<void>();

    constructor() {
        this.translate.langChanges$.subscribe(() => {
            this.sort();
            this.onChange.next();
        });

        this.sort();
    }

    sort() {
        this.categoriesList = categories.map<Category>(category => ({
            value: category,
            label: this.translate.translate(`category.${category}`),
        }));
        this.categoriesList.sort((a, b) =>
            a.value === 'other' ? 1 : b.value === 'other' ? -1 : a.label.localeCompare(b.label),
        );
    }
}
