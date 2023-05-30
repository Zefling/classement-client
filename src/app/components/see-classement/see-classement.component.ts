import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { FileString, FormatedGroup, Options } from 'src/app/interface';
import { Utils } from 'src/app/tools/utils';

import { GlobalService } from '../../services/global.service';

@Component({
    selector: 'see-classement',
    templateUrl: './see-classement.component.html',
    styleUrls: ['./see-classement.component.scss'],
})
export class SeeClassementComponent implements OnInit {
    @Input() groups: FormatedGroup[] = [];
    @Input() list: FileString[] = [];
    @Input() imagesCache: { [key: string]: string | ArrayBuffer | null } = {};

    @Input() options!: Options;

    @Input() withAnotation = false;

    nameOpacity!: string;

    constructor(private readonly globalService: GlobalService, private readonly cd: ChangeDetectorRef) {}

    ngOnInit() {
        if (!this.options) {
            return;
        }
        const val = this.globalService.updateVarCss(this.options, this.imagesCache);

        this.nameOpacity = this.globalService.getValuesFromOptions(this.options).nameOpacity;
    }

    detectChanges() {
        this.cd.detectChanges();
    }

    calcWidth(item: FileString, element: HTMLElement | null) {
        return Utils.calcWidth(this.options, item, element);
    }
}
