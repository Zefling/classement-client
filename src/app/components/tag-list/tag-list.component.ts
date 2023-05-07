import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

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

    @Input()
    set readOnly(value: any) {
        this._readOnly = coerceBooleanProperty(value);
    }
    get readOnly(): boolean {
        return this._readOnly;
    }

    @ViewChild('input') input!: ElementRef<HTMLInputElement>;

    proposals: string[] = [];

    @Output() update = new EventEmitter<string[]>();

    private suject = new Subject<void>();
    private _readOnly = false;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.suject.pipe(debounceTime(500)).subscribe(() => {
            this.http
                .get<Message<string[]>>(`${environment.api.path}api/tags/${this.input.nativeElement.value}`)
                .subscribe({
                    next: proposals => {
                        this.proposals = proposals.message;
                    },
                    error: (result: HttpErrorResponse) => {
                        this.proposals = [];
                    },
                });
        });
    }

    onInput(tag: Event) {
        console.log('>a>');
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
        this.update.next(this.tags);
    }

    remove(tag: string) {
        this.tags.splice(this.tags.indexOf(tag), 1);
        this.update.next(this.tags);
    }
}
