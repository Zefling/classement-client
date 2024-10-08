import { Pipe, PipeTransform, inject } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

import { GlobalService } from '../services/global.service';

@Pipe({
    name: 'fileSize',
    pure: false,
    standalone: true,
})
export class FileSizePipe implements PipeTransform {
    private readonly globalService = inject(GlobalService);
    private readonly translate = inject(TranslocoService);

    transform(value: number, params: Intl.NumberFormatOptions | undefined = {}): string {
        let unit = 0;
        while (value / 1024 > 9) {
            value /= 1024;
            unit++;
        }
        params.maximumSignificantDigits = 4;

        return (
            new Intl.NumberFormat(this.globalService.lang || 'en', params).format(value) +
            this.translate.translate(`unit.file.B${unit}`)
        );
    }
}
