import { ChangeDetectionStrategy, Component, HostBinding, HostListener, inject, output } from '@angular/core';

import { PreferenceInterfaceTheme } from 'src/app/interface/interface';
import { GlobalService } from 'src/app/services/global.service';

@Component({
    selector: 'light-dark',
    templateUrl: './light-dark.component.html',
    styleUrls: ['./light-dark.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightDarkComponent {
    // inject

    private readonly global = inject(GlobalService);

    // output

    readonly change = output<PreferenceInterfaceTheme>();

    // host

    @HostBinding('class.light')
    get classLight() {
        return this.global.currentTheme() === 'light';
    }

    @HostBinding('class.dark')
    get classDark() {
        return this.global.currentTheme() === 'dark';
    }

    @HostListener('click')
    click() {
        this.global.toggleTheme();
        this.global.changeThemeClass();
        if (this.global.userSchema) {
            this.change.emit(this.global.userSchema);
        }
    }
}
