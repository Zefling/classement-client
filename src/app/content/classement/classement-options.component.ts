import { Component, Input } from '@angular/core';

import { Options } from 'src/app/interface';

import { categories } from './classement-default';


@Component({
    selector: 'classement-options',
    templateUrl: './classement-options.component.html',
    styleUrls: ['./classement-options.component.scss'],
})
export class ClassementOptionsComponent {
    categories = categories;

    @Input()
    options?: Options;

    constructor() {}

    switchOptions() {
        if (this.options) {
            this.options.showAdvancedOptions = !this.options.showAdvancedOptions;
        }
    }
}
