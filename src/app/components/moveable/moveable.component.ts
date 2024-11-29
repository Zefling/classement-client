import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    NgZone,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    inject,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';

import Moveable, { EVENTS } from 'moveable';

@Component({
    selector: 'moveable-zone',
    templateUrl: './moveable.component.html',
    styleUrls: ['./moveable.component.css'],
    standalone: true,
})
export class NgxMoveableComponent implements OnDestroy, AfterViewInit, OnChanges {
    // input

    private readonly ngZone = inject(NgZone);

    // input

    readonly target = input<string>();
    readonly transform = input<string>();

    // viewChild

    private readonly targetInternal = viewChild.required<ElementRef<HTMLElement>>('target');
    private readonly container = viewChild.required<ElementRef<HTMLElement>>('container');

    // output

    readonly transformUpdate = output<string>();

    // template

    readonly transformTarget = signal<string>('');

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
