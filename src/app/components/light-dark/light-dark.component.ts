import { Component, HostBinding, HostListener, Renderer2 } from '@angular/core';

import { Logger, LoggerLevel } from '../../services/logger';
import { Utils } from '../../tools/utils';

type DarkLight = 'dark' | 'light';

@Component({
    selector: 'light-dark',
    templateUrl: './light-dark.component.html',
    styleUrls: ['./light-dark.component.scss'],
})
export class LightDarkComponent {
    browserShema!: DarkLight;
    userShema!: DarkLight;

    @HostBinding('class.light')
    get classLight() {
        return this.thisCurrent() === 'light';
    }

    @HostBinding('class.dark')
    get classDark() {
        return this.thisCurrent() === 'dark';
    }

    constructor(private renderer: Renderer2, private logger: Logger) {
        this.browserShema = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const theme = Utils.getCookie<DarkLight>('theme');
        if (theme) {
            if (['dark', 'light'].includes(theme)) {
                this.userShema = theme;
            }
            this.changeClass();

            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
                this.browserShema = event.matches ? 'dark' : 'light';
                this.changeClass();
            });
        } else {
            this.changeClass();
        }
    }

    @HostListener('click')
    click() {
        this.userShema = this.thisCurrent() === 'light' ? 'dark' : 'light';
        Utils.setCookie('theme', this.userShema);
        this.changeClass();
    }

    thisCurrent(): DarkLight {
        return this.userShema ?? this.browserShema ?? 'light';
    }

    changeClass() {
        this.logger.log('color theme:', LoggerLevel.log, this.userShema);
        this.renderer.addClass(document.body, this.thisCurrent() === 'light' ? 'light-mode' : 'dark-mode');
        this.renderer.removeClass(document.body, this.thisCurrent() !== 'light' ? 'light-mode' : 'dark-mode');
    }
}
