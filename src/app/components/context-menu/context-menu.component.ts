import { Component, HostListener, input } from '@angular/core';
import { ContextMenuDirective } from 'src/app/directives/context-menu.directive';

export interface ContextMenuItem<T> {
    label: string;
    action: (arg: T) => void;
}

export interface ContextMenuData<T> {
    contextMenu: ContextMenuItem<T>[];
    data: T;
}

@Component({
    selector: 'context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent<T> {
    items = input.required<ContextMenuData<T>>();

    active(item: ContextMenuItem<T>) {
        item.action(this.items().data);
        ContextMenuDirective._overlayRef!.dispose();
    }

    @HostListener('contextmenu', ['$event'])
    @HostListener('auxclick', ['$event'])
    onContextMenuContext(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
    }
}
