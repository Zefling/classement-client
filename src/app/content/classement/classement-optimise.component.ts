import { Component, OnInit, inject, input } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { FileString, FileType, FormattedGroup, ModeNames, OptimizedFile } from 'src/app/interface/interface';
import { GlobalService } from 'src/app/services/global.service';
import { Logger } from 'src/app/services/logger';
import { OptimiseImageService } from 'src/app/services/optimise-image.service';

import { LoadingComponent } from '../../components/loader/loading.component';
import { NumFormatPipe } from '../../pipes/num-format';

@Component({
    selector: 'classement-optimise',
    templateUrl: './classement-optimise.component.html',
    styleUrls: ['./classement-optimise.component.scss'],
    imports: [LoadingComponent, TranslocoPipe, NumFormatPipe],
})
export class ClassementOptimiseComponent implements OnInit {
    private readonly optimiseImage = inject(OptimiseImageService);
    private readonly global = inject(GlobalService);
    private readonly logger = inject(Logger);

    groups = input<FormattedGroup[]>();
    list = input<FileType[]>();
    dialog = input<DialogComponent>();
    mode = input<ModeNames>();

    totalSize!: number;
    total!: number;
    progress: number;
    totalResize: number;
    countResize: number;
    reduceSize: number;
    finalSize: number;

    start = false;

    listOptimise: OptimizedFile[];

    detail = false;

    constructor() {
        this.progress = 0;
        this.totalResize = 0;
        this.countResize = 0;
        this.reduceSize = 0;
        this.finalSize = 0;

        this.listOptimise = [];
    }

    toggle() {
        this.detail = !this.detail;
    }

    ngOnInit() {
        const { size, files } = this.optimiseImage.size(this.list(), this.groups(), this.mode());
        this.totalSize = size;
        this.total = files;
    }

    async optimise() {
        this.logger.log('optimise');
        this.start = true;
        this.progress = 0;
        this.totalResize = 0;
        this.countResize = 0;
        this.reduceSize = 0;
        this.listOptimise = [];
        if (this.mode() !== 'teams') {
            this.groups()?.forEach(group =>
                group?.list.forEach(tile => {
                    if (tile) {
                        this.optimiseImg(tile);
                    }
                }),
            );
        }

        this.list()?.forEach(tile => {
            if (tile) {
                this.optimiseImg(tile);
            }
        });
    }

    optimiseAccept() {
        this.logger.log('optimise accept');
        this.listOptimise.forEach(e => {
            if (e.reduceFile) {
                e.sourceFile.realSize = e.reduceFile.realSize;
                e.sourceFile.size = e.reduceFile.size;
                e.sourceFile.url = e.reduceFile.url;
            }
        });
        this.dialog()?.close();
        this.global.onImageUpdate.next();
    }

    private async optimiseImg(fileString: FileString) {
        const file = await this.optimiseImage.resize(fileString, 300, 300);
        this.progress++;
        this.totalResize += file.reduceFile?.realSize || 0;
        this.countResize += file.reduce > 0 ? 1 : 0;
        this.reduceSize += file.reduce;
        this.finalSize += file.reduceFile?.realSize || file.sourceFile?.realSize || 0;
        this.listOptimise.push(file);
    }
}
