import { Directive, ElementRef } from '@angular/core';

import autosize from '@github/textarea-autosize';


@Directive({ selector: 'textarea[autosize]' })
export class TextareaAutosizeDirective {
    constructor(elementRef: ElementRef<HTMLTextAreaElement>) {
        if (elementRef.nativeElement.nodeName === 'TEXTAREA') {
            autosize(elementRef.nativeElement);
        }
    }
}
