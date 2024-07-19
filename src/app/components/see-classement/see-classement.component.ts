import { ChangeDetectorRef, Component, OnInit, booleanAttribute, input } from '@angular/core';

import { Subject, debounceTime } from 'rxjs';

import { FileString, FormattedGroup, Options } from 'src/app/interface/interface';
import { Utils } from 'src/app/tools/utils';

import { GlobalService } from '../../services/global.service';

@Component({
    selector: 'see-classement',
    templateUrl: './see-classement.component.html',
    styleUrls: ['./see-classement.component.scss'],
})
export class SeeClassementComponent implements OnInit {
    groups = input<FormattedGroup[]>([]);
    list = input<(FileString | null)[]>([]);
    imagesCache = input<Record<string, string | ArrayBuffer | null>>({});

    options = input.required<Options>();

    withAnnotation = input<boolean, any>(false, { transform: booleanAttribute });
    render = input<boolean, any>(false, { transform: booleanAttribute });

    nameOpacity!: string;

    private _detectChange = new Subject<void>();

    constructor(
        private readonly globalService: GlobalService,
        private readonly cd: ChangeDetectorRef,
    ) {
        this._detectChange.pipe(debounceTime(10)).subscribe(() => {
            this.cd.detectChanges();
        });
    }

    ngOnInit() {
        if (!this.options) {
            return;
        }
        const val = this.globalService.updateVarCss(this.options(), this.imagesCache());

        this.nameOpacity = this.globalService.getValuesFromOptions(this.options()).nameOpacity;
    }

    detectChanges() {
        this._detectChange.next();
    }

    calcWidth(item: FileString, element: HTMLElement | null) {
        // hack for calcule de width of the image
        Utils.calcWidth(this.options(), item, element);
        return true;
    }
}
