import { Pipe, PipeTransform } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { GlobalService } from '../services/global.service';

@Pipe({ name: 'filesize', pure: false })
export class FileSizePipe implements PipeTransform {
    constructor(
        private readonly globalService: GlobalService,
        private readonly translate: TranslateService,
    ) {}

    transform(value: number, params: Intl.NumberFormatOptions | undefined = {}): string {
        let unit = 0;
        while (value / 1024 > 9) {
            value /= 1024;
            unit++;
        }
        params.maximumSignificantDigits = 4;

        return (
            new Intl.NumberFormat(this.globalService.lang || 'en', params).format(value) +
            this.translate.instant(`unit.file.B${unit}`)
        );
    }
}
