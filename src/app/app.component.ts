import { NgComponentOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Type,
    computed,
    effect,
    inject,
    isDevMode,
    signal,
    viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Event, Router, RouterLink, RouterLinkActive, RouterOutlet, Scroll } from '@angular/router';

import {
    Logger,
    LoggerLevel,
    MagmaClickEnterDirective,
    MagmaDialog,
    MagmaLimitFocusDirective,
    MagmaLoader,
    MagmaLoaderMessage,
    MagmaSpinner,
} from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { filter } from 'rxjs';

import { environment } from 'src/environments/environment';

import { PreferencesMagmaDialog } from './components/preferences/preferences.component';
import { ModeNames } from './interface/interface';
import { APIUserService } from './services/api.user.service';
import { GlobalService } from './services/global.service';
import { ModuleErrorHandler } from './services/module-error-handler';
import { PreferencesService } from './services/preferences.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],

    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        NgComponentOutlet,
        TranslocoPipe,
        MagmaLoader,
        MagmaSpinner,
        MagmaLoaderMessage,
        MagmaDialog,
        MagmaClickEnterDirective,
        MagmaLimitFocusDirective,
        PreferencesMagmaDialog,
    ],
    host: {
        '[class.show-menu]': 'asideOpen()',
        '[class.reduce-menu]': 'mainMenuReduce()',
        '[class.show-help]': 'showHelp()',
        '[style.--zoom]': 'preferencesService.preferences.zoomMobile',
    },
})
export class AppComponent {
    // injects

    protected readonly globalService = inject(GlobalService);
    protected readonly router = inject(Router);
    protected readonly logger = inject(Logger);
    protected readonly preferencesService = inject(PreferencesService);
    protected readonly userService = inject(APIUserService);
    protected readonly cd = inject(ChangeDetectorRef);
    protected readonly moduleErrorHandler = inject(ModuleErrorHandler);

    // viewChild

    readonly warningExit = viewChild.required<MagmaDialog>('warningExit');
    readonly choice = viewChild.required<MagmaDialog>('choice');
    readonly reloadChoice = viewChild.required<MagmaDialog>('reloadDialog');
    readonly menu = viewChild.required<ElementRef<HTMLDivElement>>('menu');
    readonly main = viewChild.required<ElementRef<HTMLDivElement>>('main');
    readonly preferences = viewChild.required<PreferencesMagmaDialog>('pref');

    // signals

    readonly asideOpen = signal<boolean>(false);
    readonly mainMenuReduce = signal<boolean>(true);
    readonly showHelp = signal<boolean>(false);
    readonly showHelpButton = signal<boolean>(false);
    readonly modeModerator = signal<boolean>(false);

    private readonly _moderatorEffect = effect(() => {
        const modeModerator = this.userService.isModerator || this.userService.isAdmin || false;
        this.modeModerator.set(modeModerator);
    });

    loading = environment.api?.active;
    modeApi = computed(() => this.globalService.withApi());

    _modeTemp?: string;
    _index = 0;
    _visibility = false;

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
        Logger.suffix = '[Classement] ';

        if (isDevMode()) {
            Logger.minLogLevel = 'log';
        }

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
            this.cd.markForCheck();
            this.main().nativeElement.scroll({ top: 0, behavior: 'auto' });
        });

        this.moduleErrorHandler.reload.subscribe(() => {
            this.reloadChoice().open();
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
                            this.cd.markForCheck();
                        });
                })
                .catch(() => {
                    this.globalService.withApi.set(false);
                    this.logger.log('Server ko !', LoggerLevel.error);
                    this.loading = false;
                });
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

    reload() {
        window.location.reload();
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
