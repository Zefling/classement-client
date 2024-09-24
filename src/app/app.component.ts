import { ChangeDetectorRef, Component, DoCheck, ElementRef, Type, inject, signal, viewChild } from '@angular/core';
import { Event, Router, Scroll } from '@angular/router';

import { filter } from 'rxjs';

import { environment } from 'src/environments/environment';

import { DialogComponent } from './components/dialog/dialog.component';
import { PreferencesDialogComponent } from './components/preferences/preferences.component';
import { ModeNames } from './interface/interface';
import { APIUserService } from './services/api.user.service';
import { GlobalService } from './services/global.service';
import { Logger, LoggerLevel } from './services/logger';
import { PreferencesService } from './services/preferences.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    host: {
        '[class.show-menu]': 'asideOpen()',
        '[class.reduce-menu]': 'mainMenuReduce()',
        '[class.show-help]': 'showHelp()',
        '[style.--zoom]': 'preferencesService.preferences.zoomMobile',
    },
})
export class AppComponent implements DoCheck {
    // injects

    protected readonly globalService = inject(GlobalService);
    private readonly router = inject(Router);
    private readonly logger = inject(Logger);
    protected readonly preferencesService = inject(PreferencesService);
    private readonly userService = inject(APIUserService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    // viewChild

    readonly warningExit = viewChild.required<DialogComponent>('warningExit');
    readonly choice = viewChild.required<DialogComponent>('choice');
    readonly main = viewChild.required<ElementRef<HTMLDivElement>>('main');
    readonly preferences = viewChild.required<PreferencesDialogComponent>('pref');

    // signals

    readonly asideOpen = signal<boolean>(false);
    readonly mainMenuReduce = signal<boolean>(true);
    readonly showHelp = signal<boolean>(false);
    readonly showHelpButton = signal<boolean>(false);
    readonly modeModerator = signal<boolean>(false);

    loading = environment.api?.active;
    modeApi = environment.api?.active || false;

    _modeTemp?: string;

    get routerUrl() {
        return this.router.url;
    }

    get logged() {
        return this.userService.logged;
    }

    helpComponent?: Type<any>;

    private route?: string;

    constructor() {
        this.globalService.onForceExit.subscribe((route?: string) => {
            this.warningExit().open();
            this.route = route;
        });

        this.globalService.onOpenChoice.subscribe(() => {
            this.choice().open();
        });

        this.globalService.helpComponent.subscribe(helpComponent => {
            this.showHelp.set(false);
            this.showHelpButton.set(helpComponent !== undefined);
            this.helpComponent = helpComponent;
        });

        this.router.events.pipe(filter((event: Event): event is Scroll => event instanceof Scroll)).subscribe(e => {
            this.changeDetectorRef.detectChanges();
            this.main().nativeElement.scroll({ top: 0, behavior: 'auto' });
        });

        if (environment.api?.active) {
            this.userService
                .initProfile()
                .then(() => {
                    this.logger.log('Auto login success!!');
                })
                .catch(() => {
                    this.logger.log('Auto login error!!', LoggerLevel.error);
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }

    ngDoCheck() {
        const modeModerator = this.userService?.isModerator || this.userService?.isAdmin || false;
        if (this.modeModerator() !== modeModerator) {
            this.modeModerator.set(modeModerator);
        }
    }

    openPreferences() {
        this.preferences().open();
    }

    toggleMenu() {
        this.asideOpen.set(!this.asideOpen());
    }

    toggleHelp() {
        this.showHelp.set(!this.showHelp());
    }

    toggleResizeMenu() {
        this.mainMenuReduce.set(!this.mainMenuReduce());
        this.preferences().preferencesForm?.get('mainMenuReduce')?.setValue(this.mainMenuReduce());
    }

    logout() {
        if (environment.api?.active) {
            this.userService.loggedStatus().then(() => {
                this.logger.log('logout start');
                this.userService.logout().then(() => {
                    this.logger.log('logout ok');
                });
            });
        }
    }

    exit(ok: boolean, save?: boolean) {
        if (ok) {
            if (save) {
                this.globalService.classementSave();
            }
            this.globalService.withChange.set(0);
            this.router.navigate([this.route]);
        }
        this.warningExit().close();
    }

    openChoice(event: MouseEvent) {
        this.toggleMenu();
        if (this.preferences().preferencesForm?.get('mode')?.value === 'choice') {
            this.choice().open();

            event.stopPropagation();
            event.preventDefault();
        }
    }

    beginNew(mode: ModeNames) {
        this.router.navigate(['edit', 'new', mode]);
        this.choice().close();
    }
}
