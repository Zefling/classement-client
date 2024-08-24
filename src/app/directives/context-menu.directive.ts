import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, HostListener, input } from '@angular/core';

import { ContextMenuComponent, ContextMenuData } from '../components/context-menu/context-menu.component';

@Directive({
    selector: '[contextMenu]',
})
export class ContextMenuDirective<T> {
    static _overlayRef?: OverlayRef;

    contextMenu = input<ContextMenuData<T>>();

    constructor(private readonly overlay: Overlay) {}

    @HostListener('contextmenu', ['$event'])
    onContextMenu(event: MouseEvent) {
        const overlayRef = this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'overlay-backdrop',
            panelClass: 'overlay-panel',
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy: this.overlay
                .position()
                .flexibleConnectedTo({ x: event.clientX, y: event.clientY })
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top',
                    },
                    {
                        originX: 'end',
                        originY: 'top',
                        overlayX: 'end',
                        overlayY: 'bottom',
                    },
                ]),
        });
        const userProfilePortal = new ComponentPortal(ContextMenuComponent);

        const component = overlayRef.attach(userProfilePortal);
        component.setInput('items', this.contextMenu());

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
