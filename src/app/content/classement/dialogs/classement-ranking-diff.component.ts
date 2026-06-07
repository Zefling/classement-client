import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, output, viewChild } from '@angular/core';

import { MagmaClickEnterDirective, MagmaDialog, MagmaMessageType, MagmaMessages } from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { Classement, FileString, FileType, FormattedGroup, ImageCache, Options } from '../../../interface/interface';
import { APIClassementService } from '../../../services/api.classement.service';

@Component({
    selector: 'classement-ranking-diff',
    templateUrl: './classement-ranking-diff.component.html',
    styleUrls: ['./classement-ranking-diff.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass, TranslocoPipe, MagmaDialog, MagmaClickEnterDirective],
})
export class ClassementRankingDiffComponent {
    private readonly classementService = inject(APIClassementService);
    private readonly mgMessage = inject(MagmaMessages);
    private readonly cd = inject(ChangeDetectorRef);

    dialogRankingDiff = viewChild.required<MagmaDialog>('dialogRankingDiff');

    templateId = input<string>();
    list = input<FileType[]>();
    groups = input<FormattedGroup[]>();
    options = input<Options>();
    imagesCache = input<ImageCache>();

    addTile = output<FileString>();

    diff: FileString[] = [];

    open() {
        const id = this.templateId();
        if (id) {
            this.classementService
                .getClassementsByTemplateId(id)
                .then(classements => {
                    this.createDiff(classements);
                })
                .catch(e => {
                    this.mgMessage.addMessage(e, {
                        type: MagmaMessageType.error,
                    });
                })
                .finally(() => {
                    this.cd.detectChanges();
                });

            this.dialogRankingDiff().open();
        }
    }

    createDiff(classements: Classement[]) {
        this.diff = [];
        // current tiles
        const list: FileType[] = [];
        list.push(...(this.list() || []));
        this.groups()?.forEach(e => list.push(...e.list));

        if (classements?.length) {
            classements.forEach(classement => {
                const listCompare: FileType[] = [];
                listCompare.push(...classement.data.list);
                classement.data.groups.forEach(e => listCompare.push(...e.list));

                listCompare.forEach(tile => {
                    if (tile) {
                        // compare with exist
                        for (const item of list) {
                            if (item && (item.url === tile.url || (!item.url && item.title == tile.title))) {
                                return;
                            }
                        }
                        // compare with previous added
                        for (const item of this.diff) {
                            if (item.url === tile.url || (!item.url && item.title == tile.title)) {
                                return;
                            }
                        }
                        this.diff.push(tile);
                    }
                });
            });
        }
    }

    close() {
        this.dialogRankingDiff().close();
    }

    addTileToList(tile: FileString) {
        this.addTile.emit(tile);

        const index = this.diff.indexOf(tile);
        if (index > -1) {
            this.diff.splice(index, 1);
        }
    }
}
