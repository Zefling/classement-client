/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CDK_DROP_LIST, CDK_DROP_LIST_GROUP, CdkDropList } from '@angular/cdk/drag-drop';
import { Directive } from '@angular/core';

/** Container that wraps a set of draggable items. */
@Directive({
    selector: '[cdkDropZone], cdk-drop-zone',
    exportAs: 'cdkDropZone',
    standalone: true,
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
    /** Registers an items with the drop list. */
    // override addItem(item: CdkDrag): void {
    //  this['_unsortedItems'].add(item);
    // }
}
