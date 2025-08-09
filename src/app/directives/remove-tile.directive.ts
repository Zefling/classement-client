import { Directive, HostListener, output } from '@angular/core';

@Directive({
    selector: '[removeTile]',
})
export class RemoveTileDirective {
    removeElement = output<void>();

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
