import { Component, HostBinding, HostListener, Renderer2 } from '@angular/core';


@Component({
    selector: 'light-dark',
    templateUrl: './light-dark.component.html',
    styleUrls: ['./light-dark.component.scss'],
})
export class LightDarkComponent {
    browserShema!: 'dark' | 'light';
    userShema!: 'dark' | 'light';

    @HostBinding('class.light')
    get classLight() {
        return this.thisCurrent() === 'light';
    }

    @HostBinding('class.dark')
    get classDark() {
        return this.thisCurrent() === 'dark';
    }

    constructor(private renderer: Renderer2) {
        this.browserShema =
            window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            this.browserShema = event.matches ? 'dark' : 'light';
        });
    }

    @HostListener('click')
    click() {
        this.userShema = this.thisCurrent() === 'light' ? 'dark' : 'light';

        this.renderer.addClass(document.body, this.userShema === 'light' ? 'light-mode' : 'dark-mode');
        this.renderer.removeClass(document.body, this.userShema !== 'light' ? 'light-mode' : 'dark-mode');
    }

    thisCurrent(): 'dark' | 'light' {
        return this.userShema ?? this.browserShema ?? 'light';
    }
}
