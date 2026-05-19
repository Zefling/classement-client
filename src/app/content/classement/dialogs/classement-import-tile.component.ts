import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, inject, output, viewChild } from '@angular/core';

import { MagmaClickEnterDirective, MagmaDialog } from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { NavigateResultComponent } from 'src/app/components/navigate-result/navigate-result.component';
import { SearchBarComponent, SearchFormFields } from 'src/app/components/search-bar/search-bar.component';
import { Classement, FileString } from 'src/app/interface/interface';
import { APIClassementService } from 'src/app/services/api.classement.service';

@Component({
    selector: 'classement-import-tile',
    templateUrl: './classement-import-tile.component.html',
    styleUrl: './classement-import-tile.component.scss',
    imports: [
        NgClass,
        NgTemplateOutlet,
        TranslocoPipe,
        SearchBarComponent,
        NavigateResultComponent,
        MagmaDialog,
        MagmaClickEnterDirective,
    ],
})
export class ClassementImportTileComponent {
    private readonly classementService = inject(APIClassementService);
    private readonly cd = inject(ChangeDetectorRef);

    dialog = viewChild.required<MagmaDialog>(MagmaDialog);

    addTile = output<FileString>();

    classements?: Classement[];
    classement?: Classement;
    list?: FileString[];

    loading = false;

    search(fields: SearchFormFields) {
        this.list = undefined;
        this.classement = undefined;
        this.loading = true;
        this.classementService
            .getClassementsByCriterion({
                name: fields.searchKey,
                category: fields.category,
                mode: fields.mode,
                all: true,
                page: 1,
                size: 24,
            })
            .then(classements => {
                this.classements = classements.list;
            })
            .catch(() => {
                this.classements = [];
            })
            .finally(() => {
                this.loading = false;
                this.cd.markForCheck();
            });
    }

    selectClassement(classement: Classement) {
        this.classement = classement;
        this.list = [];

        if (classement.data.options.mode !== 'teams') {
            for (const groups of classement.data.groups) {
                for (const item of groups.list) {
                    if (item) {
                        this.list.push(item);
                    }
                }
            }
        }
        for (const item of classement.data.list) {
            if (item) {
                this.list.push(item);
            }
        }
    }

    addTileAndRemove(tile: FileString) {
        this.addTile.emit(tile);
        this.list!.splice(this.list!.indexOf(tile), 1);
    }

    open() {
        this.dialog().open();
    }

    closeDialog() {
        this.dialog().close();
    }
}
