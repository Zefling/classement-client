import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { booleanAttribute, Directive, HostListener, input, inject } from '@angular/core';

import {
    ContextMenuComponent,
    ContextMenuData,
    ContextMenuMode,
} from '../components/context-menu/context-menu.component';

const connectedPosition: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
];

@Directive({
    selector: '[contextMenu]',
    standalone: true,
})
export class ContextMenuDirective<T> {
    private readonly overlay = inject(Overlay);

    static _overlayRef?: OverlayRef;

    contextMenu = input<ContextMenuData<T>>();
    contextMenuMode = input<ContextMenuMode>('default');
    contextMenuDisabled = input(false, { transform: booleanAttribute });

    @HostListener('contextmenu', ['$event'])
    async onContextMenu(event: MouseEvent) {
        if (this.contextMenuDisabled()) {
            return;
        }

        const overlayRef = this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'overlay-backdrop',
            panelClass: 'overlay-panel',
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy: this.overlay
                .position()
                .flexibleConnectedTo({ x: event.clientX, y: event.clientY })
                .withPositions(connectedPosition),
        });
        const userProfilePortal = new ComponentPortal(ContextMenuComponent);

        const component = overlayRef.attach(userProfilePortal);
        component.setInput('items', this.contextMenu());
        component.setInput('mode', this.contextMenuMode());

        overlayRef.backdropClick().subscribe(() => {
            overlayRef.dispose();
            ContextMenuDirective._overlayRef = undefined;
        });

        ContextMenuDirective._overlayRef = overlayRef;

        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener('window:contextmenu', ['$event'])
    onContextMenuContext(event: MouseEvent) {
        if (ContextMenuDirective._overlayRef) {
            this.close(event);
        }
    }

    @HostListener('window:auxclick', ['$event'])
    onContextMenuAux(event: MouseEvent) {
        if (event.button === 1 && ContextMenuDirective._overlayRef) {
            this.close(event);
        }
    }

    private close(event: MouseEvent) {
        ContextMenuDirective._overlayRef!.dispose();
        ContextMenuDirective._overlayRef = undefined;
        event.preventDefault();
        event.stopPropagation();
    }
}
