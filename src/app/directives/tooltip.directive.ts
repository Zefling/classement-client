import { Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';


@Directive({ selector: '[tooltip]' })
export class TooltipDirective implements OnDestroy {
    @Input() tooltip = '';
    @Input() delayEnter? = 200;
    @Input() delayLeave? = 0; // 0 to infini

    private tooltipElement?: HTMLDivElement;
    private timer?: number;

    constructor(private element: ElementRef<HTMLElement>) {}

    ngOnDestroy(): void {
        if (this.tooltipElement) {
            this.tooltipElement.remove();
        }
    }

    @HostListener('mouseenter')
    onMouseEnter() {
        this.timer = setTimeout(() => {
            const { x, y } = this.position();
            this.createTooltip(x, y);
        }, this.delayEnter);
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.ngOnDestroy();
    }

    private position(): { x: number; y: number } {
        const element = this.element.nativeElement;
        const rect = element.getBoundingClientRect();
        const x = rect.left + element.offsetWidth / 2;
        const y = rect.top + element.offsetHeight + 6;
        return { x, y };
    }

    private createTooltip(x: number, y: number) {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        const tooltipElement = document.createElement('div');
        tooltipElement.innerHTML = this.tooltip;
        tooltipElement.setAttribute('class', 'tooltip-container');
        tooltipElement.style.top = y.toString() + 'px';
        tooltipElement.style.left = x.toString() + 'px';

        document.body.appendChild(tooltipElement);
        this.tooltipElement = tooltipElement;

        if (this.delayLeave) {
            setTimeout(() => {
                this.ngOnDestroy();
            }, this.delayLeave);
        }
    }
}
