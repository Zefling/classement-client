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
        this.browserShema = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        this.changeClass();

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            this.browserShema = event.matches ? 'dark' : 'light';
            this.changeClass();
        });
    }

    @HostListener('click')
    click() {
        this.userShema = this.thisCurrent() === 'light' ? 'dark' : 'light';
        this.changeClass();
    }

    thisCurrent(): 'dark' | 'light' {
        return this.userShema ?? this.browserShema ?? 'light';
    }

    changeClass() {
        console.log('color theme:', this.userShema);
        this.renderer.addClass(document.body, this.thisCurrent() === 'light' ? 'light-mode' : 'dark-mode');
        this.renderer.removeClass(document.body, this.thisCurrent() !== 'light' ? 'light-mode' : 'dark-mode');
    }
}
