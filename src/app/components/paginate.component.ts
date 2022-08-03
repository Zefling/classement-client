import { Component, DoCheck, Input } from '@angular/core';
import { Router } from '@angular/router';


interface Page {
    page?: number;
    view?: string;
    current?: boolean;
    separator?: boolean;
}

@Component({
    selector: 'paginate-cmp',
    templateUrl: './paginate.component.html',
    styleUrls: ['./paginate.component.scss'],
})
export class PaginationComponent implements DoCheck {
    @Input() page = 1;
    @Input() total = 0;
    @Input() base?: string;
    @Input() size = 25;

    @Input() start = 3;
    @Input() middleStart = 3;
    @Input() middleEnd = 3;
    @Input() end = 3;

    pages: Page[] = [];

    private _test = 0;

    constructor(private route: Router) {}

    ngDoCheck() {
        const pages = [];
        let currentPage = +this.page;
        let test = 0;

        const nbPages = this.size ? Math.ceil((this.total ?? 0) / this.size) : 0;

        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > nbPages) {
            currentPage = nbPages;
        }

        const addPage = (index: number) => {
            const link: Page = {};
            link.current = currentPage === index;
            link.view = `${index}`;
            link.page = index;
            test += index;
            pages.push(link);
        };

        let i: number;
        const startPos = this.start;
        const middleStartPos = currentPage - this.middleStart;
        const middleEndPos = currentPage + this.middleEnd;
        const endPos = nbPages - this.end + 1;

        for (i = 1; i <= Math.min(startPos, nbPages); i++) {
            addPage(i);
        }
        if (startPos + 1 < middleStartPos) {
            pages.push({ separator: true });
        }
        for (i = Math.max(startPos + 1, middleStartPos); i <= Math.min(middleEndPos, nbPages); i++) {
            addPage(i);
        }
        if (middleEndPos + 1 < endPos) {
            pages.push({ separator: true });
        }
        for (let i = Math.max(middleEndPos + 1, endPos); i <= nbPages; i++) {
            addPage(i);
        }

        if (this._test != test) {
            this._test = test;
            this.pages = pages;
        }
    }
}
