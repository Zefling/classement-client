import { Directive, ElementRef, OnDestroy, inject } from '@angular/core';

import autosize from '@github/textarea-autosize';

@Directive({
    selector: 'textarea[autosize]',
    standalone: true,
})
export class TextareaAutosizeDirective implements OnDestroy {
    autosize?: { unsubscribe(): void };

    constructor() {
        const elementRef = inject<ElementRef<HTMLTextAreaElement>>(ElementRef);

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
