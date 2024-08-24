import { Component, HostListener, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ContextMenuDirective } from 'src/app/directives/context-menu.directive';

export interface ContextMenuItem<T> {
    icon: string;
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
    standalone: true,
    imports: [TranslocoModule],
})
export class ContextMenuComponent<T> {
    items = input.required<ContextMenuData<T>>();

    active(item: ContextMenuItem<T>) {
        item.action(this.items().data);
        ContextMenuDirective._overlayRef!.dispose();

        ContextMenuDirective._overlayRef = undefined;
    }

    @HostListener('contextmenu', ['$event'])
    @HostListener('auxclick', ['$event'])
    onContextMenuContext(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
    }
}
