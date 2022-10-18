import { ChangeDetectorRef, Component, Input } from '@angular/core';

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
    @Input() imagesCache: { [key: string]: string | ArrayBuffer | null } = {};

    @Input() options!: Options;

    @Input() withAnotation = false;

    nameOpacity!: string;

    constructor(private globalService: GlobalService, private cd: ChangeDetectorRef) {}

    ngDoCheck() {
        if (!this.options) {
            return;
        }

        const val = this.globalService.updateVarCss(this.options);
        this.nameOpacity = val.nameOpacity;
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
