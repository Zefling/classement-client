import { Component, Input } from '@angular/core';

import { UploadProgress } from '../../services/api.classement.service';

/**
 * Loader with message and/or progress bar
 */
@Component({
    selector: 'loader-cmp',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
    @Input()
    message?: string;

    @Input()
    progress?: UploadProgress;
}
