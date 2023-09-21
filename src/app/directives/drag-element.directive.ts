import { Directionality } from '@angular/cdk/bidi';
import {
    CDK_DRAG_CONFIG,
    CDK_DRAG_HANDLE,
    CDK_DRAG_PARENT,
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    DragDrop,
    DragDropConfig,
} from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import {
    ChangeDetectorRef,
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Inject,
    InjectionToken,
    NgZone,
    Optional,
    Output,
    Self,
    SkipSelf,
    ViewContainerRef,
} from '@angular/core';

const DRAG_HOST_CLASS = 'cdk-drag';

/**
 * Injection token that can be used to reference instances of `CdkDropList`. It serves as
 * alternative token to the actual `CdkDropList` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const CDK_DROP_LIST = new InjectionToken<CdkDropList>('CdkDropList');

/** Element that can be moved inside a CdkDropList container. */
@Directive({
    selector: '[cdkDragElement]',
    exportAs: 'cdkDragElement',
    standalone: true,
    host: {
        class: DRAG_HOST_CLASS,
        '[class.cdk-drag-disabled]': 'disabled',
        '[class.cdk-drag-dragging]': '_dragRef.isDragging()',
    },
    providers: [{ provide: CDK_DRAG_PARENT, useExisting: CdkDragElement }],
})
export class CdkDragElement<T = any> extends CdkDrag {
    constructor(
        /** Element that the draggable is attached to. */
        element: ElementRef<HTMLElement>,
        /** Droppable container that the draggable is a part of. */
        @Inject(CDK_DROP_LIST)
        @Optional()
        @SkipSelf()
        dropContainer: CdkDropList,
        /**
         * @deprecated `_document` parameter no longer being used and will be removed.
         * @breaking-change 12.0.0
         */
        @Inject(DOCUMENT)
        _document: any,
        _ngZone: NgZone,
        _viewContainerRef: ViewContainerRef,
        @Optional()
        @Inject(CDK_DRAG_CONFIG)
        config: DragDropConfig,
        @Optional()
        _dir: Directionality,
        dragDrop: DragDrop,
        _changeDetectorRef: ChangeDetectorRef,
        @Optional()
        @Self()
        @Inject(CDK_DRAG_HANDLE)
        _selfHandle?: CdkDragHandle,
        @Optional()
        @SkipSelf()
        @Inject(CDK_DRAG_PARENT)
        _parentDrag?: CdkDrag,
    ) {
        super(
            element,
            dropContainer,
            _document,
            _ngZone,
            _viewContainerRef,
            config,
            _dir,
            dragDrop,
            _changeDetectorRef,
            _selfHandle,
            _parentDrag,
        );
    }

    @Output()
    removeElement = new EventEmitter<CdkDrag>();

    @HostListener('auxclick', ['$event'])
    remove(event: MouseEvent) {
        if (event.button === 1) {
            this.removeElement.emit(this);
        }
    }
}
