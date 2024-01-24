import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[removeTile]',
})
export class RemoveTileDirective {
    @Output()
    removeElement = new EventEmitter<void>();

    @HostListener('auxclick', ['$event'])
    remove(event: MouseEvent) {
        if (event.button === 1) {
            this.removeElement.emit();

            // prevent copy on Linux
            event.stopPropagation();
            event.preventDefault();
        }
    }
}
