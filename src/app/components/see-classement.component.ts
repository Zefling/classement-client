import { Component, Input } from '@angular/core';

import { FileString, FormatedGroup, Options } from 'src/app/interface';

import { GlobalService } from '../services/global.service';


@Component({
    selector: 'see-classement',
    templateUrl: './see-classement.component.html',
    styleUrls: ['./see-classement.component.scss'],
})
export class SeeClassementComponent {
    @Input() groups: FormatedGroup[] = [];
    @Input() list: FileString[] = [];

    @Input() options!: Options;

    @Input() withAnotation = false;

    nameOpacity!: string;

    constructor(private globalService: GlobalService) {}

    ngDoCheck() {
        if (!this.options) {
            return;
        }

        const val = this.globalService.updateVarCss(this.options);
        this.nameOpacity = val.nameOpacity;
    }
}
