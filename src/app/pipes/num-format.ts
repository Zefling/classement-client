import { Pipe, PipeTransform, inject } from '@angular/core';

import { GlobalService } from '../services/global.service';

@Pipe({
    name: 'numFormat',
    standalone: true,
})
export class NumFormatPipe implements PipeTransform {
    private readonly globalService = inject(GlobalService);

    transform(value: number, params?: Intl.NumberFormatOptions | undefined): string {
        return new Intl.NumberFormat(this.globalService.lang || 'en', params).format(value);
    }
}
