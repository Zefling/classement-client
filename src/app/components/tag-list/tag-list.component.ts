import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { Subject, debounceTime } from 'rxjs';

import { environment } from 'src/environments/environment';

import { Message } from '../info-messages/info-messages.component';

@Component({
    selector: 'tag-list',
    templateUrl: './tag-list.component.html',
    styleUrls: ['./tag-list.component.scss'],
})
export class TagListComponent implements OnInit, AfterViewInit {
    @Input() tags: string[] = [];

    @ViewChild('input') input!: ElementRef<HTMLInputElement>;

    proposals: string[] = [];

    private suject = new Subject<void>();

    constructor(private http: HttpClient) {}
    ngAfterViewInit(): void {
        throw new Error('Method not implemented.');
    }

    ngOnInit(): void {
        this.suject.pipe(debounceTime(500)).subscribe(() => {
            this.http.get<Message>(`${environment.api.path}api/tag/${this.input.nativeElement.value}`).subscribe({
                next: () => {
                    console.log('>>>');
                },
                error: (result: HttpErrorResponse) => {
                    console.log('<<<');
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
    }
}
