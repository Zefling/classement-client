import { Component, Input, Renderer2, RendererStyleFlags2 } from '@angular/core';

import { FileString, FormatedGroup, Options } from 'src/app/interface';
import { color } from 'src/app/tools/function';

import { defaultOptions } from '../content/classement/classement-default';


@Component({
    selector: 'see-classement',
    templateUrl: './see-classement.component.html',
    styleUrls: ['./see-classement.component.scss'],
})
export class SeeClassementComponent {
    @Input() groups: FormatedGroup[] = [];
    @Input() list: FileString[] = [];

    @Input() options!: Options;

    nameOpacity!: string;

    constructor(private renderer: Renderer2) {}

    ngDoCheck() {
        if (!this.options) {
            return;
        }

        const body = document.body;
        const o = this.options;
        const r = this.renderer.setStyle;
        const dash = RendererStyleFlags2.DashCase;

        // item
        const itemWidth = o.itemWidthAuto ? 'auto' : (o.itemWidth ?? defaultOptions.itemWidth) + 'px';
        r(body, '--over-item-width', itemWidth, dash);
        r(body, '--over-item-height', (o.itemHeight ?? defaultOptions.itemHeight) + 'px', dash);
        r(body, '--over-item-padding', (o.itemPadding ?? defaultOptions.itemPadding) + 'px', dash);
        r(body, '--over-item-border', (o.itemBorder ?? defaultOptions.itemBorder) + 'px', dash);
        r(body, '--over-item-margin', (o.itemMargin ?? defaultOptions.itemMargin) + 'px', dash);
        r(body, '--over-item-background', color(o.itemBackgroundColor, o.itemBackgroundOpacity), dash);
        r(body, '--over-item-border-color', color(o.itemBorderColor, o.itemBorderOpacity), dash);
        r(body, '--over-item-text-color', o.itemTextColor ?? defaultOptions.itemTextColor, dash);
        r(body, '--over-item-text-background', color(o.itemTextBackgroundColor, o.itemTextBackgroundOpacity), dash);
        // drop zone group
        r(body, '--over-drop-list-background', color(o.lineBackgroundColor, o.lineBackgroundOpacity), dash);
        r(body, '--over-drop-list-border-color', color(o.lineBorderColor, o.lineBorderOpacity), dash);
        // name group
        r(body, '--over-name-width', (o.nameWidth ?? defaultOptions.nameWidth) + 'px', dash);
        r(body, '--over-name-font-size', (o.nameFontSize ?? defaultOptions.nameFontSize) + '%', dash);
        // image background
        r(body, '--over-image-background', o.imageBackgroundColor, dash);
        r(body, '--over-image-width', (o.imageWidth ?? defaultOptions.imageWidth) + 'px', dash);
        r(
            body,
            '--over-image-url',
            o.imageBackgroundImage !== 'none' ? 'url(./assets/themes/' + o.imageBackgroundImage + '.svg)' : null,
            dash,
        );

        this.nameOpacity =
            Math.round(o.nameBackgroundOpacity * 2.55)
                ?.toString(16)
                .padStart(2, '0') ?? 'FF';
    }
}
