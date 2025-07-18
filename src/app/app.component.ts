import {
    ChangeDetectorRef,
    Component,
    DoCheck,
    ElementRef,
    Type,
    computed,
    inject,
    signal,
    viewChild,
} from '@angular/core';
import { Event, Router, Scroll } from '@angular/router';

import { MagmaDialog } from '@ikilote/magma';

import { filter } from 'rxjs';

import { environment } from 'src/environments/environment';

import { PreferencesMagmaDialog } from './components/preferences/preferences.component';
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
    standalone: false,
})
export class AppComponent implements DoCheck {
    // injects

    protected readonly globalService = inject(GlobalService);
    protected readonly router = inject(Router);
    protected readonly logger = inject(Logger);
    protected readonly preferencesService = inject(PreferencesService);
    protected readonly userService = inject(APIUserService);
    protected readonly changeDetectorRef = inject(ChangeDetectorRef);

    // viewChild

    readonly warningExit = viewChild.required<MagmaDialog>('warningExit');
    readonly choice = viewChild.required<MagmaDialog>('choice');
    readonly menu = viewChild.required<ElementRef<HTMLDivElement>>('menu');
    readonly main = viewChild.required<ElementRef<HTMLDivElement>>('main');
    readonly preferences = viewChild.required<PreferencesMagmaDialog>('pref');

    // signals

    readonly asideOpen = signal<boolean>(false);
    readonly mainMenuReduce = signal<boolean>(true);
    readonly showHelp = signal<boolean>(false);
    readonly showHelpButton = signal<boolean>(false);
    readonly modeModerator = signal<boolean>(false);

    loading = environment.api?.active;
    modeApi = computed(() => this.globalService.withApi());

    _modeTemp?: string;
    _index = 0;
    _visiblity = false;

    readonly modes: { id: ModeNames; icon?: string }[] = [
        { id: 'default', icon: 'tierlist' },
        { id: 'teams' },
        { id: 'columns' },
        { id: 'iceberg' },
        { id: 'axis' },
        { id: 'bingo' },
    ];

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

        if (this.modeApi()) {
            this.userService
                .serverTest()
                .then(() => {
                    this.logger.log('Server ok !');
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
                })
                .catch(() => {
                    this.globalService.withApi.set(false);
                    this.logger.log('Server ko !', LoggerLevel.error);
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

    toggleMenu(target: 'none' | 'main' | 'menu' = 'main') {
        this.asideOpen.set(!this.asideOpen());

        if (target === 'main') {
            this.main().nativeElement.focus();
        } else if (target === 'menu') {
            this.menu().nativeElement.focus();
        }
    }

    toggleHelp() {
        this.showHelp.set(!this.showHelp());
    }

    toggleResizeMenu() {
        this.mainMenuReduce.set(!this.mainMenuReduce());
        this.preferences().preferencesForm?.get('mainMenuReduce')?.setValue(this.mainMenuReduce());
    }

    logout() {
        if (this.modeApi()) {
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

    openChoice() {
        if (this.preferences().preferencesForm?.get('mode')?.value === 'choice') {
            this.choice().open();
        }
    }

    beginNew(mode: ModeNames) {
        this.router.navigate(['edit', 'new', mode]);
        this.choice().close();
    }
}
