import { Component, HostListener, input, OnInit, output } from '@angular/core';

import { imageInfos } from 'src/app/content/classement/classement-default';

import { Theme } from '../../interface/interface';
import { color } from '../../tools/function';

@Component({
    selector: 'theme-icon',
    templateUrl: './theme-icon.component.html',
    styleUrls: ['./theme-icon.component.scss'],
})
export class ThemeIconComponent implements OnInit {
    theme = input.required<Theme>();

    select = output<Theme>();

    styles: any;

    ngOnInit() {
        this.getStyles();
    }

    @HostListener('click')
    click() {
        this.select.emit(this.theme());
    }

    getStyles() {
        const o = this.theme().options;
        this.styles = {
            '--o-item-width': o.itemWidth + 'px',
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
                o.imageBackgroundImage !== 'none'
                    ? 'url(./assets/themes/' + imageInfos[o.imageBackgroundImage]!.normal + ')'
                    : null,
            '--o-name-width': o.nameWidth + 'px',
            '--o-name-font-size': o.nameFontSize + '%',
        };
    }
}
