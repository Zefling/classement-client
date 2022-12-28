import { GlobalService } from '../../services/global.service';

import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { FileString, FormatedGroup, Options } from 'src/app/interface';

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

    constructor(private globalService: GlobalService, private cd: ChangeDetectorRef) {}

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
        return this.options.itemWidthAuto && !item.title
            ? ((item.width || 150) / (item.height || 150)) * this.options.itemHeight
            : this.options.itemWidthAuto && element
            ? Math.max(
                  (((item.width || 150) - 16) / (item.height || 150)) * this.options.itemHeight,
                  element?.scrollWidth,
              )
            : null;
    }
}
