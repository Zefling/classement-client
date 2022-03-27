import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Theme } from '../interface';
import { color } from '../tools/function';

@Component({
    selector: 'theme-icon',
    templateUrl: './theme-icon.component.html',
    styleUrls: ['./theme-icon.component.scss'],
})
export class ThemeIconComponent implements OnInit {
    @Input()
    theme!: Theme;

    @Output()
    select = new EventEmitter<Theme>();

    styles: any;

    constructor(private domSanitizer: DomSanitizer) {}

    ngOnInit() {
        this.styles = this.getStyles();
    }

    @HostListener('click')
    click() {
        this.select.emit(this.theme);
    }

    getStyles() {
        const o = this.theme.options;
        return {
            '--o-item-width': o.imageWidth + 'px',
            '--o-item-height': o.itemHeight + 'px',
            '--o-item-padding': o.itemPadding + 'px',
            '--o-item-border': o.itemBorder + 'px',
            '--o-item-margin': o.itemMargin + 'px',
            '--o-content-box-background': color(o.itemBackgroundColor, o.itemBackgroundOpacity),
            '--o-content-box-border': color(o.itemBorderColor, o.itemBorderOpacity),
            '--o-drop-list-background': color(o.lineBackgroundColor, o.lineBackgroundOpacity),
            '--o-drop-list-border-color': color(o.lineBorderColor, o.lineBorderOpacity),
            '--o-image-background': o.imageBackgroundColor,
            '--o-image-width': o.imageWidth + 'px',
            '--o-image-url':
                o.imageBackgroundImage !== 'none' ? 'url(./assets/themes/' + o.imageBackgroundImage + '.svg)' : null,
            '--o-name-width': o.nameWidth + 'px',
            '--o-name-font-size': o.nameFontSize + '%',
        };
    }
}
