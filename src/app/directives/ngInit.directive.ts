import { Directive, OnInit, output } from '@angular/core';

@Directive({
    selector: '[ngInit]',
    standalone: true,
})
export class NgInitDirective implements OnInit {
    ngInit = output<void>();

    ngOnInit() {
        this.ngInit.emit();
    }
}
