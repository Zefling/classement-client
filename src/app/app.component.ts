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
    MagmaInput,
    MagmaInputElement,
    MagmaInputSelect,
    MagmaInputTextarea,
    MagmaLimitFocusDirective,
    MagmaLoader,
    MagmaLoaderMessage,
    MagmaPointerModeService,
    MagmaSpinner,
} from '@ikilote/magma';
import { TranslocoPipe } from '@jsverse/transloco';

import { Select2Option } from 'ng-select2-component';
import { filter } from 'rxjs';

import { PreferencesMagmaDialog } from './components/preferences/preferences.component';
import { defaultOptions, defaultTheme } from './content/classement/classement-default';
import { FileString, FormattedGroup, ModeNames } from './interface/interface';
import { APIUserService } from './services/api.user.service';
import { GlobalService } from './services/global.service';
import { ModuleErrorHandler } from './services/module-error-handler';
import { PreferencesService } from './services/preferences.service';

import { environment } from '../environments/environment';

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
        MagmaInput,
        MagmaInputElement,
        MagmaInputSelect,
        MagmaInputTextarea,
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
    private readonly pointerMode = inject(MagmaPointerModeService);

    // viewChild

    readonly warningExit = viewChild.required<MagmaDialog>('warningExit');
    readonly choice = viewChild.required<MagmaDialog>('choice');
    readonly reloadChoice = viewChild.required<MagmaDialog>('reloadDialog');
    readonly textBingo = viewChild.required<MagmaDialog>('textBingo');
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
    _visibility = false;

    bingoTextInput = '';
    bingoTextSize = 5;
    readonly bingoTextSizes: Select2Option[] = [
        { value: 3, label: '3×3' },
        { value: 5, label: '5×5' },
        { value: 7, label: '7×7' },
    ];

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

        effect(() => {
            this.moderatorUpdate();
        });

        this.globalService.onForceExit.subscribe((route?: string) => {
            this.warningExit().open();
            this.route = route;
        });

        this.globalService.onOpenChoice.subscribe(() => {
            this.choice().open();
        });

        this.userService.afterLogin.subscribe(() => {
            this.moderatorUpdate();
            this.cd.markForCheck();
        });
        this.userService.afterLogout.subscribe(() => {
            this.moderatorUpdate();
            this.cd.markForCheck();
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
                            this.moderatorUpdate();
                            this.cd.markForCheck();
                        });
                })
                .catch(() => {
                    this.globalService.withApi.set(false);
                    this.logger.log('Server ko !', LoggerLevel.error);
                    this.loading = false;
                    this.cd.markForCheck();
                });
        }
    }

    openPreferences() {
        this.preferences().open();
    }

    toggleMenu(target: 'none' | 'main' | 'menu' = 'main') {
        this.asideOpen.set(!this.asideOpen());

        if (this.pointerMode.isKeyboard()) {
            if (target === 'main') {
                this.main().nativeElement.focus();
            } else if (target === 'menu') {
                this.menu().nativeElement.focus();
            }
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

    openTextBingo() {
        this.choice().close();
        this.bingoTextInput = '';
        this.textBingo().open();
    }

    closeTextBingo() {
        this.bingoTextInput = '';
        this.textBingo().close();
    }

    beginTextBingo() {
        const size = +this.bingoTextSize;
        const total = size * size;
        const centerIndex = size % 2 === 1 ? Math.floor(total / 2) : -1;

        // Parse lines into text tiles
        const lines = this.bingoTextInput
            .split('\n')
            .map(l => l.trim())
            .filter(l => l !== '');

        const makeTile = (title: string): FileString => ({
            id: `tile-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`,
            name: '',
            size: title.length,
            realSize: title.length,
            type: 'plain/text',
            date: Date.now(),
            title,
        });

        // Build the flat grid (size×size):
        // - center slot gets the next line, or 'FREE' if none provided (odd grids only)
        // - other empty slots get a tile with empty title instead of null
        const grid: FileString[] = new Array(total);
        let lineIdx = 0;
        for (let i = 0; i < total; i++) {
            grid[i] =
                i === centerIndex
                    ? makeTile(lines[lineIdx] !== undefined ? lines[lineIdx++] : 'FREE')
                    : makeTile(lineIdx < lines.length ? lines[lineIdx++] : '');
        }

        // Extra tiles beyond the grid go into the pool list
        const list = lines.slice(lineIdx).map(makeTile);

        // Distribute the flat grid into FormattedGroup rows
        const groups: FormattedGroup[] = Array.from({ length: size }, (_, row) => ({
            name: '',
            bgColor: '#ffffff',
            txtColor: '#000000',
            list: grid.slice(row * size, (row + 1) * size),
        }));

        const baseOptions = defaultTheme('bingo-s')!.options;
        this.globalService.jsonTmp = {
            options: {
                ...defaultOptions,
                ...baseOptions,
                sizeX: size,
                sizeY: size,
                itemTextPosition: 'bottom',
                itemTextMinLine: 1,
                itemWidthAuto: false,
                itemHeightAuto: false,
            },
            groups,
            list,
        };

        this.textBingo().close();
        this.router.navigate(['edit', 'new', 'bingo']);
    }

    private moderatorUpdate() {
        const modeModerator = this.userService.isModerator || this.userService.isAdmin || false;
        this.modeModerator.set(modeModerator);
    }
}
