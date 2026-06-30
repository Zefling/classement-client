import { CdkDrag, Point } from '@angular/cdk/drag-drop';
import { AfterViewInit, Directive, inject } from '@angular/core';

/** Element that can be freely positioned inside a CdkDropZone container. */
@Directive({
    selector: '[cdkDragElement]',
    exportAs: 'cdkDragElement',
    hostDirectives: [
        {
            directive: CdkDrag,
            inputs: [
                'cdkDragData: cdkDragData',
                'cdkDragLockAxis: cdkDragLockAxis',
                'cdkDragBoundary: cdkDragBoundary',
                'cdkDragStartDelay: cdkDragStartDelay',
                'cdkDragFreeDragPosition: cdkDragFreeDragPosition',
                'cdkDragDisabled: cdkDragDisabled',
                'cdkDragConstrainPosition: cdkDragConstrainPosition',
                'cdkDragPreviewClass: cdkDragPreviewClass',
                'cdkDragPreviewContainer: cdkDragPreviewContainer',
                'cdkDragScale: cdkDragScale',
                'cdkDragRootElement: cdkDragRootElement',
            ],
            outputs: [
                'cdkDragStarted: cdkDragStarted',
                'cdkDragReleased: cdkDragReleased',
                'cdkDragEnded: cdkDragEnded',
                'cdkDragEntered: cdkDragEntered',
                'cdkDragExited: cdkDragExited',
                'cdkDragDropped: cdkDragDropped',
                'cdkDragMoved: cdkDragMoved',
            ],
        },
    ],
})
export class CdkDragElement implements AfterViewInit {
    readonly cdkDrag = inject(CdkDrag);

    /** Position to apply once the view is initialized. */
    private _pendingPosition: Point | null = null;
    private _viewInitialized = false;

    get data() {
        return this.cdkDrag.data;
    }

    get freeDragPosition(): Point | undefined {
        return this.cdkDrag.freeDragPosition;
    }

    set freeDragPosition(pos: Point | undefined) {
        if (pos) {
            this.cdkDrag.freeDragPosition = pos;
        }
    }

    ngAfterViewInit() {
        this._viewInitialized = true;
        if (this._pendingPosition) {
            this.cdkDrag.setFreeDragPosition(this._pendingPosition);
            this._pendingPosition = null;
        }
    }

    getFreeDragPosition(): Readonly<Point> {
        return this.cdkDrag.getFreeDragPosition();
    }

    /**
     * Sets the free drag position. If the view is already initialized, applies immediately.
     * Otherwise, stores it as pending to be applied in ngAfterViewInit.
     */
    setFreeDragPosition(pos: Point | undefined): void {
        if (!pos) return;
        if (this._viewInitialized) {
            this.cdkDrag.setFreeDragPosition(pos);
        } else {
            this._pendingPosition = pos;
        }
    }
}
