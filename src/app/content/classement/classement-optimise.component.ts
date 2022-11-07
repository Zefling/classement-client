import { Component, Input, OnInit } from '@angular/core';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { FileString, FormatedGroup, OptimisedFile } from 'src/app/interface';
import { Logger } from 'src/app/services/logger';
import { OptimiseImageService } from 'src/app/services/optimise-image.service';


@Component({
    selector: 'classement-optimise',
    templateUrl: './classement-optimise.component.html',
    styleUrls: ['./classement-optimise.component.scss'],
})
export class ClassementOptimiseComponent implements OnInit {
    @Input()
    groups?: FormatedGroup[];

    @Input()
    list?: FileString[];

    @Input()
    dialog?: DialogComponent;

    totalSize!: number;
    total!: number;
    progress: number;
    totalResize: number;
    countResize: number;
    reduceSize: number;
    finalSize: number;

    start = false;

    listOptimise: OptimisedFile[];

    detail = false;

    constructor(private optimiseImage: OptimiseImageService, private logger: Logger) {
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
        let taille = 0;
        let count = 0;
        if (this.list) {
            this.list.forEach(e => {
                if (e.url?.startsWith('data')) {
                    taille += e.realSize;
                    count++;
                }
            });
        }
        if (this.groups) {
            this.groups.forEach(f =>
                f?.list.forEach(e => {
                    if (e.url?.startsWith('data')) {
                        taille += e.realSize;
                        count++;
                    }
                }),
            );
        }
        this.totalSize = taille;
        this.total = count;
    }

    async optimise() {
        this.logger.log('optimise');
        this.start = true;
        this.progress = 0;
        this.totalResize = 0;
        this.countResize = 0;
        this.reduceSize = 0;
        this.listOptimise = [];
        if (this.groups) {
            this.groups.forEach(f =>
                f?.list.forEach(e => {
                    this.optimiseImg(e);
                }),
            );
        }
        if (this.list) {
            this.list.forEach(e => {
                this.optimiseImg(e);
            });
        }
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
        this.dialog?.close();
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
