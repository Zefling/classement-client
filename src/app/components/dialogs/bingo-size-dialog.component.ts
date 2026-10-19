import { Component, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
    MagmaDialog,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputSelect,
} from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { Select2Option } from 'ng-select2-component';

import { defaultOptions, defaultTheme } from '../../content/classement/classement-default';
import { FileType, FormattedGroup } from '../../interface/interface';
import { GlobalService } from '../../services/global.service';

/**
 * Intermediate dialog shown when creating a normal (image) bingo: lets the user
 * pick a grid size (3×3 … 7×7 or a custom x×y) and, for odd square grids, an
 * optional "Free" center cell, then builds the empty bingo grid and navigates
 * to the editor.
 */
@Component({
    selector: 'bingo-size-dialog',
    templateUrl: './bingo-size-dialog.component.html',
    imports: [
        FormsModule,
        TranslocoPipe,
        MagmaDialog,
        MagmaInput,
        MagmaInputCheckbox,
        MagmaInputElement,
        MagmaInputNumber,
        MagmaInputSelect,
    ],
})
export class BingoSizeDialogComponent {
    private readonly globalService = inject(GlobalService);
    private readonly router = inject(Router);

    readonly dialog = viewChild.required<MagmaDialog>('dialog');

    bingoSize: number | 'custom' = 5;
    bingoCustomX = 5;
    bingoCustomY = 5;
    bingoFreeCell = false;
    readonly bingoSizes: Select2Option[] = [
        { value: 3, label: '3×3' },
        { value: 4, label: '4×4' },
        { value: 5, label: '5×5' },
        { value: 6, label: '6×6' },
        { value: 7, label: '7×7' },
        { value: 'custom', label: 'custom' },
    ];

    open() {
        this.bingoSize = 5;
        this.bingoCustomX = 5;
        this.bingoCustomY = 5;
        this.bingoFreeCell = false;
        this.dialog().open();
    }

    close() {
        this.dialog().close();
    }

    /**
     * The "Free" center cell is only meaningful for a square grid with an odd
     * side (5×5, 7×7), which has a single center cell. It is hidden otherwise.
     */
    get bingoFreeCellAvailable(): boolean {
        if (this.bingoSize === 'custom') {
            const x = +this.bingoCustomX;
            const y = +this.bingoCustomY;
            return x === y && x % 2 === 1;
        }
        return this.bingoSize === 5 || this.bingoSize === 7;
    }

    begin() {
        const sizeX = this.bingoSize === 'custom' ? this.clampBingoSize(this.bingoCustomX) : (this.bingoSize as number);
        const sizeY = this.bingoSize === 'custom' ? this.clampBingoSize(this.bingoCustomY) : (this.bingoSize as number);
        const total = sizeX * sizeY;

        // A Free cell sits at the exact center, only on an odd square grid.
        const freeCell = this.bingoFreeCell && this.bingoFreeCellAvailable;
        const centerIndex = freeCell ? Math.floor(total / 2) : -1;

        // Build the flat grid: empty slots are null (images are added later in the
        // editor); only the center gets a FREE text tile when requested.
        const grid: FileType[] = new Array(total);
        for (let i = 0; i < total; i++) {
            grid[i] =
                i === centerIndex
                    ? {
                          id: `tile-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`,
                          name: '',
                          size: 4,
                          realSize: 4,
                          type: 'plain/text',
                          date: Date.now(),
                          title: 'FREE',
                      }
                    : null;
        }

        const groups: FormattedGroup[] = Array.from({ length: sizeY }, (_, row) => ({
            name: '',
            bgColor: '#ffffff',
            txtColor: '#000000',
            list: grid.slice(row * sizeX, (row + 1) * sizeX),
        }));

        const baseOptions = defaultTheme('bingo-s')!.options;
        this.globalService.jsonTmp = {
            options: {
                ...defaultOptions,
                ...baseOptions,
                sizeX,
                sizeY,
            },
            groups,
            list: [],
        };

        this.dialog().close();
        this.router.navigate(['edit', 'new', 'bingo']);
    }

    private clampBingoSize(value: number): number {
        return Math.min(20, Math.max(1, Math.round(+value || 1)));
    }
}
