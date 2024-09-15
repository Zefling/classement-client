import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, booleanAttribute, inject, input, output, viewChild } from '@angular/core';

import { Subject, debounceTime } from 'rxjs';

import { FormsModule } from '@angular/forms';
import { Message } from 'src/app/content/user/user.interface';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'tag-list',
    templateUrl: './tag-list.component.html',
    styleUrls: ['./tag-list.component.scss'],
    standalone: true,
    imports: [FormsModule],
})
export class TagListComponent implements OnInit {
    private readonly http = inject(HttpClient);

    // input

    tags = input.required<string[]>();
    readOnly = input(false, { transform: booleanAttribute });
    allowTagClick = input(false, { transform: booleanAttribute });

    // output

    update = output<string[]>();
    tagClick = output<string>();

    // viewChild

    input = viewChild.required<ElementRef<HTMLInputElement>>('input');

    proposals: string[] = [];

    private subject = new Subject<void>();

    ngOnInit(): void {
        if (environment.api?.active) {
            this.subject.pipe(debounceTime(500)).subscribe(() => {
                const tag = this.input().nativeElement.value.trim();
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
        this.subject.next();
    }

    onEnter() {
        const input = this.input().nativeElement;
        const value = input.value;
        if (!this.tags().includes(value)) {
            this.tags().push(value);
        }
        input.value = '';
        input.focus();
        this.update.emit(this.tags());
    }

    remove(tag: string) {
        this.tags().splice(this.tags().indexOf(tag), 1);
        this.update.emit(this.tags());
    }

    onTagClick(tag: string) {
        this.tagClick.emit(tag);
    }
}
