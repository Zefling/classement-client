import { Component, Input } from '@angular/core';

import { Options } from 'src/app/interface';


@Component({
    selector: 'classement-options',
    templateUrl: './classement-options.component.html',
    styleUrls: ['./classement-options.component.scss'],
})
export class ClassementOptionsComponent {
    categories: String[] = ['anime', 'game', 'video.game', 'board.game', 'movie', 'series', 'vehicle', 'other'];

    @Input()
    options?: Options;

    advenceOptions = false;

    constructor() {}

    switchOptions() {
        this.advenceOptions = !this.advenceOptions;
    }
}
