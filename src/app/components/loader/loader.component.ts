import { Component, input } from '@angular/core';

import { LoadingComponent } from './loading.component';

import { FileSizePipe } from '../../pipes/file-size';
import { UploadProgress } from '../../services/api.classement.service';

/**
 * Loader with message and/or progress bar
 */
@Component({
    selector: 'loader-cmp',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    imports: [LoadingComponent, FileSizePipe]
})
export class LoaderComponent {
    // input

    readonly message = input<string>();
    readonly progress = input<UploadProgress>();
}
