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

    constructor(private route: Router) {}

    ngDoCheck() {
        const pages = [];
        let currentPage = +this.page;

        const page = this.size ? Math.ceil((this.total ?? 0) / this.size) : 0;

        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > page) {
            currentPage = page;
        }

        let separator = false;
        for (let i = 1; i <= page; i++) {
            const fin = this.total - this.end;

            if (
                i <= this.start ||
                (i >= currentPage - this.middleStart && i <= currentPage + this.middleEnd) ||
                i > page - this.end
            ) {
                const link: Page = {};

                if (separator) {
                    link.separator = true;
                    separator = false;
                }

                link.current = currentPage === i;
                link.view = `${i}`;
                link.page = i;

                pages.push(link);
            } else if (!separator) {
                separator = true;
            }
        }

        this.pages = pages;
    }
}
