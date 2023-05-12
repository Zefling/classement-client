import { Pipe, PipeTransform } from '@angular/core';

import { GlobalService } from '../services/global.service';

@Pipe({ name: 'numFormat' })
export class NumFormatPipe implements PipeTransform {
    constructor(private readonly globalService: GlobalService) {}

    transform(value: number, params?: Intl.NumberFormatOptions | undefined): string {
        return new Intl.NumberFormat(this.globalService.lang || 'en', params).format(value);
    }
}
