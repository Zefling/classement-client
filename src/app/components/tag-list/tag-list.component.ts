import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'tag-list',
    templateUrl: './tag-list.component.html',
    styleUrls: ['./tag-list.component.scss'],
})
export class TagListComponent implements OnInit {
    @Input() tags: string[] = [];

    @ViewChild('input') input!: ElementRef<HTMLInputElement>;

    proposals: string[] = [];

    constructor(private http: HttpClient) {}

    ngOnInit(): void {}

    onInput(tag: Event) {
        this.proposals = ['test1', 'test2', 'test3', 'test4'];

        // this.http.get<Message>(`${environment.api.path}api/tag/${tag}`).subscribe({
        //     next: result => {
        //         result.message;
        //     },
        //     error: (result: HttpErrorResponse) => {},
        // });
    }

    onEnter(tag: KeyboardEvent) {
        if ((tag.target as any)?.value) {
            this.proposals.push((tag.target as any).value);
        }
    }
}
