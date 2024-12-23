import { Component, DoCheck, OnDestroy, OnInit, inject, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Subscriptions } from 'src/app/tools/subscriptions';

import { GlobalService } from '../../services/global.service';

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
    imports: [RouterLink],
})
export class PaginationComponent implements OnInit, DoCheck, OnDestroy {
    // inject

    private readonly global = inject(GlobalService);

    // input

    readonly page = input(1, { transform: numberAttribute });
    readonly total = input(0, { transform: numberAttribute });
    readonly base = input<string>();
    readonly size = input(25, { transform: numberAttribute });
    readonly queryParams = input<{}>({});

    readonly start = input(3, { transform: numberAttribute });
    readonly middleStart = input(3, { transform: numberAttribute });
    readonly middleEnd = input(3, { transform: numberAttribute });
    readonly end = input(3, { transform: numberAttribute });

    // template

    pages: Page[] = [];
    currentPage = 1;

    private _test = 0;

    private readonly subs = Subscriptions.instance();

    constructor() {
        this.subs.push(
            this.global.onPageUpdate.subscribe(page => {
                this.update(page);
            }),
        );
    }

    ngOnInit(): void {
        this.currentPage = this.page();
    }

    ngDoCheck(): void {
        const pages = [];
        let currentPage = +this.currentPage;
        let test = 0;

        const nbPages = this.size ? Math.ceil((this.total() ?? 0) / this.size()) : 0;

        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > nbPages) {
            currentPage = nbPages;
        }

        const addPage = (pageNbr: number) => {
            const link: Page = {};
            link.current = currentPage === pageNbr;
            link.view = `${pageNbr}`;
            link.page = pageNbr;
            test += pageNbr;
            pages.push(link);
        };

        let i: number;
        const startPos = this.start();
        const middleStartPos = currentPage - this.middleStart();
        const middleEndPos = currentPage + this.middleEnd();
        const endPos = nbPages - this.end() + 1;

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

    ngOnDestroy(): void {
        this.subs.clear();
    }

    update(page: number, event: boolean = true): void {
        if (this.currentPage !== page) {
            this.currentPage = page;
            this.pages.forEach(e => (e.current = e.page === page));
            if (event) {
                this.global.onPageUpdate.next(page);
            }
        }
    }

    pageQueryParams(page: number): {} {
        return { page: page, ...this.queryParams() };
    }
}
