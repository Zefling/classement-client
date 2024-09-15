import { Directive, ElementRef, HostListener, input, numberAttribute, OnDestroy, inject } from '@angular/core';

@Directive({
    selector: '[tooltip]',
    standalone: true,
})
export class TooltipDirective implements OnDestroy {
    private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

    tooltip = input('');
    delayEnter = input(200, { transform: numberAttribute });
    delayLeave = input(0, { transform: numberAttribute }); // 0 to infini

    private tooltipElement?: HTMLDivElement;
    private timer?: NodeJS.Timeout;

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
        }, this.delayEnter());
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
        tooltipElement.innerHTML = this.tooltip();
        document.body.appendChild(tooltipElement);
        tooltipElement.setAttribute('class', 'tooltip-container');
        tooltipElement.style.top = y.toString() + 'px';

        const rect = tooltipElement.getBoundingClientRect();
        tooltipElement.style.left = Math.max(Math.abs(rect.left) + 5, x).toString() + 'px';

        this.tooltipElement = tooltipElement;

        if (this.delayLeave()) {
            setTimeout(() => {
                this.ngOnDestroy();
            }, this.delayLeave());
        }
    }
}
