import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    inject,
    input,
    NgZone,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    viewChild,
} from '@angular/core';

export declare const ANGULAR_MOVEABLE_OUTPUTS: [
    'beforeRenderStart',
    'beforeRender',
    'beforeRenderEnd',
    'beforeRenderGroupStart',
    'beforeRenderGroup',
    'beforeRenderGroupEnd',
    'changeTargets',
    'snap',
    'bound',
    'pinchStart',
    'pinch',
    'pinchEnd',
    'pinchGroupStart',
    'pinchGroup',
    'pinchGroupEnd',
    'dragStart',
    'drag',
    'dragEnd',
    'dragGroupStart',
    'dragGroup',
    'dragGroupEnd',
    'resizeStart',
    'beforeResize',
    'resize',
    'resizeEnd',
    'resizeGroupStart',
    'beforeResizeGroup',
    'resizeGroup',
    'resizeGroupEnd',
    'scaleStart',
    'beforeScale',
    'scale',
    'scaleEnd',
    'scaleGroupStart',
    'beforeScaleGroup',
    'scaleGroup',
    'scaleGroupEnd',
    'warpStart',
    'warp',
    'warpEnd',
    'rotateStart',
    'beforeRotate',
    'rotate',
    'rotateEnd',
    'rotateGroupStart',
    'beforeRotateGroup',
    'rotateGroup',
    'rotateGroupEnd',
    'scroll',
    'scrollGroup',
    'dragOriginStart',
    'dragOrigin',
    'dragOriginEnd',
    'clipStart',
    'clip',
    'clipEnd',
    'roundStart',
    'round',
    'roundEnd',
    'roundGroupStart',
    'roundGroup',
    'roundGroupEnd',
    'click',
    'clickGroup',
    'renderStart',
    'render',
    'renderEnd',
    'renderGroupStart',
    'renderGroup',
    'renderGroupEnd',
];

import Moveable, { EVENTS } from 'moveable';

@Component({
    selector: 'moveable-zone',
    templateUrl: './moveable.component.html',
    styleUrls: ['./moveable.component.scss'],
})
export class NgxMoveableComponent implements OnDestroy, AfterViewInit, OnChanges {
    private ngZone = inject(NgZone);

    private targetInternal = viewChild.required<ElementRef<HTMLElement>>('target');
    private container = viewChild.required<ElementRef<HTMLElement>>('container');

    protected moveable!: Moveable;

    target = input<string>();

    constructor() {
        EVENTS.forEach(name => {
            (this as any)[name] = new EventEmitter();
        });
    }

    ngAfterViewInit(): void {
        const events: Record<string, (event: any) => void> = {};

        EVENTS.forEach(name => {
            events[name] = (event: any) => {
                console.log('event', name, event);
                if (name === 'scale' || name === 'rotate') {
                    event.target.style.transform = event.drag.transform;
                }
                if (name === 'drag') {
                    event.target.style.transform = event.transform;
                }
            };
        });
        setTimeout(() => {
            this.moveable = this.ngZone.runOutsideAngular(
                () =>
                    new Moveable(this.container().nativeElement, {
                        target: this.target()
                            ? document.getElementById(this.target()!)
                            : this.targetInternal().nativeElement,
                        scalable: true,
                        throttleScale: 0,
                        keepRatio: true,
                        rotatable: true,
                        draggable: true,
                        renderDirections: ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'],
                        warpSelf: true,
                    }),
            );

            this.moveable.on(events);
        }, 100);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.moveable) {
            return;
        }
        for (const name in changes) {
        }
    }

    ngOnDestroy() {
        this.moveable.destroy();
    }
}
