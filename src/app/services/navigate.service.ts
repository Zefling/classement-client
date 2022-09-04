import { Injectable } from '@angular/core';


/**
 * For persistence during the session of use
 */
@Injectable({ providedIn: 'root' })
export class NavigateService {
    searchKey = '';
    category = '';
}
