import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    OnChanges,
    OnInit,
    SimpleChanges,
    booleanAttribute,
    input,
    output,
} from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

import { imageInfos } from 'src/app/content/classement/classement-default';

import { Theme, ThemesNames } from '../../interface/interface';
import { color } from '../../tools/function';

@Component({
    selector: 'theme-icon',
    templateUrl: './theme-icon.component.html',
    styleUrls: ['./theme-icon.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslocoPipe],
})
export class ThemeIconComponent<T = ThemesNames> implements OnInit, OnChanges {
    // input

    readonly theme = input.required<Theme<T>>();
    readonly custom = input(false, { transform: booleanAttribute });

    // output

    readonly select = output<Theme<T>>();

    // template

    styles: any;

    ngOnInit() {
        this.getStyles();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['theme']) {
            this.ngOnInit();
        }
    }

    @HostListener('click')
    click() {
        this.select.emit(this.theme());
    }

    getStyles() {
        const options = this.theme().options;
        if (options) {
            this.styles = {
                '--o-item-width': options.itemWidth + 'px',
                '--o-item-height': options.itemHeight + 'px',
                '--o-item-padding': options.itemPadding + 'px',
                '--o-item-border': options.borderSize + options.itemBorder + 'px',
                '--o-item-margin': options.itemMargin + 'px',
                '--o-content-box-background': color(options.itemBackgroundColor, options.itemBackgroundOpacity),
                '--o-content-box-border': color(options.itemBorderColor, options.itemBorderOpacity),
                '--o-drop-list-background': color(options.lineBackgroundColor, options.lineBackgroundOpacity),
                '--o-drop-list-border-color': color(options.lineBorderColor, options.lineBorderOpacity),
                '--o-image-background': options.imageBackgroundColor,
                '--o-image-width': options.imageWidth + 'px',
                '--o-image-url':
                    options.imageBackgroundImage !== 'none' && options.imageBackgroundImage !== 'custom'
                        ? 'url(./assets/themes/' + imageInfos[options.imageBackgroundImage]!.normal + ')'
                        : options.imageBackgroundImage === 'custom'
                          ? 'url(' + options.imageBackgroundCustom + ')'
                          : null,
                '--o-name-width': options.nameWidth + 'px',
                '--o-name-font-size': options.nameFontSize + '%',
            };
        }
    }
}
