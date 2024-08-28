import { ChangeDetectorRef, Component, DoCheck, ElementRef, signal, Type, viewChild } from '@angular/core';
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
    },
})
export class AppComponent implements DoCheck {
    warningExit = viewChild.required<DialogComponent>('warningExit');
    choice = viewChild.required<DialogComponent>('choice');
    main = viewChild.required<ElementRef<HTMLDivElement>>('main');
    preferences = viewChild.required<PreferencesDialogComponent>('pref');

    loading = environment.api?.active;

    asideOpen = signal<boolean>(false);
    mainMenuReduce = signal<boolean>(true);
    showHelp = signal<boolean>(false);
    showHelpButton = signal<boolean>(false);

    modeModerator = false;

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

    constructor(
        private readonly globalService: GlobalService,
        private readonly router: Router,
        private readonly logger: Logger,
        protected readonly preferencesService: PreferencesService,
        private readonly userService: APIUserService,
        changeDetectorRef: ChangeDetectorRef,
    ) {
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

        router.events.pipe(filter((event: Event): event is Scroll => event instanceof Scroll)).subscribe(e => {
            changeDetectorRef.detectChanges();
            this.main().nativeElement.scroll({ top: 0, behavior: 'auto' });
        });

        if (environment.api?.active) {
            userService
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
        if (this.modeModerator !== modeModerator) {
            this.modeModerator = modeModerator;
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
