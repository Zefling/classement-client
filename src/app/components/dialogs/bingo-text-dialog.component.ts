import { Component, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MagmaDialog, MagmaInput, MagmaInputElement, MagmaInputSelect, MagmaInputTextarea } from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { Select2Option } from 'ng-select2-component';

import { defaultOptions, defaultTheme } from '../../content/classement/classement-default';
import { FileString, FormattedGroup } from '../../interface/interface';
import { GlobalService } from '../../services/global.service';

/**
 * Intermediate dialog shown when creating a "text bingo": lets the user pick a
 * grid size and paste one tile text per line, then builds the bingo grid and
 * navigates to the editor.
 */
@Component({
    selector: 'bingo-text-dialog',
    templateUrl: './bingo-text-dialog.component.html',
    imports: [FormsModule, TranslocoPipe, MagmaDialog, MagmaInput, MagmaInputElement, MagmaInputSelect, MagmaInputTextarea],
})
export class BingoTextDialogComponent {
    private readonly globalService = inject(GlobalService);
    private readonly router = inject(Router);

    readonly dialog = viewChild.required<MagmaDialog>('dialog');

    bingoTextInput = '';
    bingoTextSize = 5;
    readonly bingoTextSizes: Select2Option[] = [
        { value: 3, label: '3×3' },
        { value: 5, label: '5×5' },
        { value: 7, label: '7×7' },
    ];

    open() {
        this.bingoTextInput = '';
        this.dialog().open();
    }

    close() {
        this.bingoTextInput = '';
        this.dialog().close();
    }

    begin() {
        const size = +this.bingoTextSize;
        const total = size * size;
        const centerIndex = size % 2 === 1 ? Math.floor(total / 2) : -1;

        // Parse lines into text tiles
        const lines = this.bingoTextInput
            .split('\n')
            .map(l => l.trim())
            .filter(l => l !== '');

        const makeTile = (title: string): FileString => ({
            id: `tile-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`,
            name: '',
            size: title.length,
            realSize: title.length,
            type: 'plain/text',
            date: Date.now(),
            title,
        });

        // Build the flat grid (size×size):
        // - center slot gets the next line, or 'FREE' if none provided (odd grids only)
        // - other empty slots get a tile with empty title instead of null
        const grid: FileString[] = new Array(total);
        let lineIdx = 0;
        for (let i = 0; i < total; i++) {
            grid[i] =
                i === centerIndex
                    ? makeTile(lines[lineIdx] !== undefined ? lines[lineIdx++] : 'FREE')
                    : makeTile(lineIdx < lines.length ? lines[lineIdx++] : '');
        }

        // Extra tiles beyond the grid go into the pool list
        const list = lines.slice(lineIdx).map(makeTile);

        // Distribute the flat grid into FormattedGroup rows
        const groups: FormattedGroup[] = Array.from({ length: size }, (_, row) => ({
            name: '',
            bgColor: '#ffffff',
            txtColor: '#000000',
            list: grid.slice(row * size, (row + 1) * size),
        }));

        const baseOptions = defaultTheme('bingo-s')!.options;
        this.globalService.jsonTmp = {
            options: {
                ...defaultOptions,
                ...baseOptions,
                sizeX: size,
                sizeY: size,
                itemTextPosition: 'bottom',
                itemTextMinLine: 1,
                itemWidthAuto: false,
                itemHeightAuto: false,
            },
            groups,
            list,
        };

        this.dialog().close();
        this.router.navigate(['edit', 'new', 'bingo']);
    }
}
