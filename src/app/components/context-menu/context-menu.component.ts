import { Component, HostListener, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ContextMenuDirective } from 'src/app/directives/context-menu.directive';

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
    {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
    }[Keys];

type ContextMenuItemBase<T> = {
    iconText?: string;
    icon?: string;
    label?: string;
    action: (arg: T) => void;
};

export type ContextMenuItem<T> = RequireOnlyOne<ContextMenuItemBase<T>, 'iconText' | 'icon'>;

export interface ContextMenuData<T> {
    contextMenu: ContextMenuItem<T>[];
    data: T;
}

export type ContextMenuMode = 'default' | 'bubble';

@Component({
    selector: 'context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss'],
    standalone: true,
    imports: [TranslocoModule],
    host: {
        '[class.default]': 'mode() === "default"',
        '[class.bubble]': 'mode() === "bubble"',
    },
})
export class ContextMenuComponent<T> {
    items = input.required<ContextMenuData<T>>();
    mode = input<ContextMenuMode>('default');

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
