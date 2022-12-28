import { Directive, ElementRef, OnDestroy } from '@angular/core';

import autosize from '@github/textarea-autosize';

@Directive({ selector: 'textarea[autosize]' })
export class TextareaAutosizeDirective implements OnDestroy {
    autosize?: { unsubscribe(): void };

    constructor(elementRef: ElementRef<HTMLTextAreaElement>) {
        setTimeout(() => {
            if (elementRef.nativeElement.nodeName === 'TEXTAREA') {
                this.autosize = autosize(elementRef.nativeElement);
            }
        });
    }

    ngOnDestroy(): void {
        this.autosize?.unsubscribe();
    }
}
