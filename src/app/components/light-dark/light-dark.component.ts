import { Component, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

import { PreferenceInterfaceTheme } from 'src/app/interface/interface';
import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'light-dark',
    templateUrl: './light-dark.component.html',
    styleUrls: ['./light-dark.component.scss'],
})
export class LightDarkComponent {
    @HostBinding('class.light')
    get classLight() {
        return this.global.currentTheme() === 'light';
    }

    @HostBinding('class.dark')
    get classDark() {
        return this.global.currentTheme() === 'dark';
    }

    @Output()
    change = new EventEmitter<PreferenceInterfaceTheme>();

    constructor(private global: GlobalService) {}

    @HostListener('click')
    click() {
        this.global.toggleTheme();
        this.global.changeThemeClass();
        this.change.emit(this.global.userSchema);
    }
}
