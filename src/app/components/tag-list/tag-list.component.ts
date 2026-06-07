import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    booleanAttribute,
    computed,
    inject,
    input,
    output,
    viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Subject, debounceTime } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Message } from '../../interface/interface';
import { GlobalService } from '../../services/global.service';

@Component({
    selector: 'tag-list',
    templateUrl: './tag-list.component.html',
    styleUrls: ['./tag-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, RouterLink],
})
export class TagListComponent implements OnInit {
    // inject

    private readonly http = inject(HttpClient);
    private readonly globalService = inject(GlobalService);
    private readonly cd = inject(ChangeDetectorRef);

    // input

    readonly tags = input.required<string[]>();
    readonly readOnly = input(false, { transform: booleanAttribute });
    readonly allowTagClick = input(false, { transform: booleanAttribute });
    readonly link = input<'parent' | 'children'>();

    // output

    readonly update = output<string[]>();
    readonly tagClick = output<string>();

    // viewChild

    readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

    // template

    proposals: string[] = [];

    modeApi = computed(() => this.globalService.withApi());

    private subject = new Subject<void>();

    ngOnInit(): void {
        if (this.modeApi()) {
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
                        complete: () => {
                            this.cd.markForCheck();
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
