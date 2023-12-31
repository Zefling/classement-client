import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, booleanAttribute } from '@angular/core';

import { Subject, debounceTime } from 'rxjs';

import { Message } from 'src/app/content/user/user.interface';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'tag-list',
    templateUrl: './tag-list.component.html',
    styleUrls: ['./tag-list.component.scss'],
})
export class TagListComponent implements OnInit {
    @Input() tags: string[] = [];

    @Input({ transform: booleanAttribute }) readOnly = false;

    @Input({ transform: booleanAttribute }) allowTagClick = false;

    @ViewChild('input') input!: ElementRef<HTMLInputElement>;

    proposals: string[] = [];

    @Output() update = new EventEmitter<string[]>();
    @Output() tagClick = new EventEmitter<string>();

    private suject = new Subject<void>();

    constructor(private readonly http: HttpClient) {}

    ngOnInit(): void {
        if (environment.api?.active) {
            this.suject.pipe(debounceTime(500)).subscribe(() => {
                const tag = this.input.nativeElement.value.trim();
                if (tag) {
                    this.http.get<Message<string[]>>(`${environment.api.path}api/tags/${tag}`).subscribe({
                        next: proposals => {
                            this.proposals = proposals.message;
                        },
                        error: (_result: HttpErrorResponse) => {
                            this.proposals = [];
                        },
                    });
                }
            });
        }
    }

    onInput() {
        this.suject.next();
    }

    onEnter() {
        const input = this.input.nativeElement;
        const value = input.value;
        if (!this.tags.includes(value)) {
            this.tags.push(value);
        }
        input.value = '';
        input.focus();
        this.update.emit(this.tags);
    }

    remove(tag: string) {
        this.tags.splice(this.tags.indexOf(tag), 1);
        this.update.emit(this.tags);
    }

    onTagClick(tag: string) {
        this.tagClick.next(tag);
    }
}
