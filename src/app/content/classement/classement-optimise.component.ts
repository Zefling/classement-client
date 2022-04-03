import { Component, DoCheck, Input } from '@angular/core';

import { FileString, FormatedGroup } from 'src/app/interface';
import {
  OptimisedFile,
  OptimiseImageService,
} from 'src/app/services/optimise-image.service';


@Component({
    selector: 'classement-optimise',
    templateUrl: './classement-optimise.component.html',
    styleUrls: ['./classement-optimise.component.scss'],
})
export class ClassementOptimiseComponent implements DoCheck {
    @Input()
    groups?: FormatedGroup[];

    @Input()
    list?: FileString[];

    totalSize!: number;
    total!: number;
    progress = 0;
    totalResize = 0;
    countResize = 0;
    reduceSize = 0;

    listOptimise: OptimisedFile[] = [];

    detail = false;

    constructor(private optimiseImage: OptimiseImageService) {}

    toggle() {
        this.detail = !this.detail;
    }

    ngDoCheck() {
        let taille = 0;
        let count = 0;
        if (this.list) {
            this.list.forEach(e => {
                taille += e.realSize;
                count++;
            });
        }
        if (this.groups) {
            this.groups.forEach(f =>
                f?.list.forEach(e => {
                    taille += e.realSize;
                    count++;
                }),
            );
        }
        this.totalSize = taille;
        this.total = count;
    }

    optimise() {
        console.log('optimise');
        this.progress = 0;
        this.totalResize = 0;
        this.countResize = 0;
        this.reduceSize = 0;
        this.listOptimise = [];
        if (this.groups) {
            this.groups.forEach(async f =>
                f?.list.forEach(async e => {
                    const file = await this.optimiseImage.resize(e, 300, 300);
                    this.progress++;
                    this.totalResize += file.reduceFile?.realSize || 0;
                    this.countResize += file.reduce > 0 ? 1 : 0;
                    this.reduceSize += file.reduce;
                    this.listOptimise.push(file);
                }),
            );
        }
        if (this.list) {
            this.list.forEach(async e => {
                const file = await this.optimiseImage.resize(e, 300, 300);
                this.progress++;
                this.totalResize += file.reduceFile?.realSize || 0;
                this.countResize += file.reduce > 0 ? 1 : 0;
                this.reduceSize += file.reduce;
                this.listOptimise.push(file);
            });
        }
    }

    optimiseAccept() {
        console.log('optimise accept');
        this.listOptimise.forEach(e => {
            if (e.reduceFile) {
                e.sourceFile.realSize = e.reduceFile.realSize;
                e.sourceFile.size = e.reduceFile.size;
                e.sourceFile.url = e.reduceFile.url;
            }
        });
    }
}
