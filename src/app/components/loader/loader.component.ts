import { Component, input } from '@angular/core';

import { FileSizePipe } from '../../pipes/file-size';
import { UploadProgress } from '../../services/api.classement.service';
import { LoadingComponent } from './loading.component';

/**
 * Loader with message and/or progress bar
 */
@Component({
    selector: 'loader-cmp',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    standalone: true,
    imports: [LoadingComponent, FileSizePipe],
})
export class LoaderComponent {
    message = input<string>();

    progress = input<UploadProgress>();
}
