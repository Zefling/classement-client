import { CDK_DROP_LIST, CDK_DROP_LIST_GROUP, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { Directive } from '@angular/core';

/** Container that wraps a set of draggable items in free-positioning mode. */
@Directive({
    selector: '[cdkDropZone], cdk-drop-zone',
    exportAs: 'cdkDropZone',
    providers: [
        // Prevent child drop lists from picking up the same group as their parent.
        { provide: CDK_DROP_LIST_GROUP, useValue: undefined },
        { provide: CDK_DROP_LIST, useExisting: CdkDropZone },
    ],
    host: {
        class: 'cdk-drop-zone',
        '[attr.id]': 'id',
        '[class.cdk-drop-list-disabled]': 'disabled',
        '[class.cdk-drop-list-dragging]': '_dropListRef.isDragging()',
        '[class.cdk-drop-list-receiving]': '_dropListRef.isReceiving()',
    },
})
export class CdkDropZone<T = any> extends CdkDropList {
    constructor() {
        super();
        // Patch withItems() on the DropListRef so it never calls _withDropContainer
        // on child DragRefs. This prevents the DragRef from leaving free-drag mode
        // when a drag starts (beforeStarted triggers _syncItemsWithRef → withItems).
        const ref = this._dropListRef;
        const originalWithItems = ref.withItems.bind(ref);
        ref.withItems = (items: any[]) => {
            // Call the original but then immediately clear _dropContainer on each item
            // so the DragRef stays in free-drag mode.
            originalWithItems(items);
            for (const dragRef of items) {
                dragRef._dropContainer = undefined;
            }
            return ref;
        };
    }

    /**
     * Track items internally but do NOT assign the drop container on the DragRef.
     * The standard addItem() calls _withDropContainer() which sets _dropContainer,
     * causing setFreeDragPosition() to skip _applyRootElementTransform().
     */
    override addItem(item: CdkDrag): void {
        this['_unsortedItems'].add(item);
        // Do NOT call item._dragRef._withDropContainer() — keep free-drag mode.
    }
}
