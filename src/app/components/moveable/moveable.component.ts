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
    output,
    signal,
    SimpleChanges,
    viewChild,
} from '@angular/core';

import Moveable, { EVENTS } from 'moveable';

@Component({
    selector: 'moveable-zone',
    templateUrl: './moveable.component.html',
    styleUrls: ['./moveable.component.scss'],
    standalone: true,
})
export class NgxMoveableComponent implements OnDestroy, AfterViewInit, OnChanges {
    private ngZone = inject(NgZone);

    private targetInternal = viewChild.required<ElementRef<HTMLElement>>('target');
    private container = viewChild.required<ElementRef<HTMLElement>>('container');

    target = input<string>();
    transform = input<string>();

    transformTarget = signal<string>('');

    transformUpdate = output<string>();

    protected moveable!: Moveable;

    constructor() {
        EVENTS.forEach(name => {
            (this as any)[name] = new EventEmitter();
        });
    }

    ngAfterViewInit(): void {
        const events: Record<string, (event: any) => void> = {};

        this.transformTarget.set(this.transform() || '');

        EVENTS.forEach(name => {
            events[name] = (event: any) => {
                let transform: string | undefined = undefined;

                if (name === 'scale' || name === 'rotate') {
                    transform = event.drag.transform;
                } else if (name === 'drag') {
                    transform = event.transform;
                }

                if (transform) {
                    this.transformUpdate.emit(event.target.style.transform);
                    this.transformTarget.set(transform);
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
