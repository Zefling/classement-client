import { Directive, EventEmitter, OnInit, Output } from '@angular/core';

@Directive({
    selector: '[ngInit]',
})
export class NgInitDirective implements OnInit {
    @Output()
    ngInit: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.ngInit.emit();
    }
}
