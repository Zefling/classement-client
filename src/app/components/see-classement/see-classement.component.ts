import { ChangeDetectorRef, Component, OnInit, booleanAttribute, input } from '@angular/core';

import { Subject, debounceTime } from 'rxjs';

import { FileString, FileType, FormattedGroup, Options } from 'src/app/interface/interface';
import { Utils } from 'src/app/tools/utils';

import { Select2Option } from 'ng-select2-component';
import { DataService } from 'src/app/services/data.service';
import { GlobalService } from '../../services/global.service';

@Component({
    selector: 'see-classement',
    templateUrl: './see-classement.component.html',
    styleUrls: ['./see-classement.component.scss'],
})
export class SeeClassementComponent implements OnInit {
    groups = input.required<FormattedGroup[]>();
    list = input.required<FileType[]>();
    imagesCache = input<Record<string, string | ArrayBuffer | null>>({});
    id = input.required<string>();

    options = input.required<Options>();

    withAnnotation = input<boolean, any>(false, { transform: booleanAttribute });
    render = input<boolean, any>(false, { transform: booleanAttribute });

    nameOpacity!: string;

    checkChoices: Select2Option[] = [
        { value: 'A', label: 'check.round' },
        { value: 'B', label: 'check' },
        { value: 'C', label: 'circle' },
        { value: 'D', label: 'hanamaru' },
        { value: 'E', label: 'heart' },
    ];
    checkChoice = 'A';

    private _detectChange = new Subject<void>();

    constructor(
        private readonly globalService: GlobalService,
        private readonly dataService: DataService<boolean>,
        private readonly cd: ChangeDetectorRef,
    ) {
        this._detectChange.pipe(debounceTime(10)).subscribe(() => {
            this.cd.detectChanges();
        });
    }

    ngOnInit() {
        const val = this.globalService.updateVarCss(this.options(), this.imagesCache());

        this.nameOpacity = this.globalService.getValuesFromOptions(this.options()).nameOpacity;

        if (this.options().mode === 'bingo') {
            this.dataService.init(this.id());
        }
    }

    check(group: number, item: number) {
        return this.dataService.change(this.id(), group, item, !this.value(group, item));
    }

    value(group: number, item: number): boolean {
        return this.dataService.value(this.id(), group, item) ?? false;
    }

    clear() {
        this.dataService.clear(this.id());
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
