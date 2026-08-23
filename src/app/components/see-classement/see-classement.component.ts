import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    booleanAttribute,
    computed,
    inject,
    input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
    ContextMenuItem,
    MagmaContextMenu,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputSelect,
    MagmaNgInitDirective,
    MagmaTooltipDirective,
    Subscriptions,
} from '@ikilote/magma';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { Select2Option } from 'ng-select2-component';
import { MarkdownComponent } from 'ngx-markdown';

import { HelpBingoEmojiComponent } from '../../content/navigate/help/help.bingo.component';
import { FileString, FileType, FormattedGroup, Options } from '../../interface/interface';
import { DataService } from '../../services/data.service';
import { GlobalService } from '../../services/global.service';
import { PreferencesService } from '../../services/preferences.service';
import { emojis } from '../../tools/emoji';
import { color } from '../../tools/function';
import { Utils } from '../../tools/utils';
import { NgxMoveableComponent } from '../moveable/moveable.component';
import { ZoneAreaComponent } from '../zone-area/zone-area.component';
import { ZoneAxisComponent } from '../zone-axis/zone-axis.component';

export interface ItemSelection {
    content?: string;
    transform?: string;
    visible?: boolean;
}
const defaultTransform = 'translate(15px, 12px) rotate(-5deg)';

@Component({
    selector: 'see-classement',
    templateUrl: './see-classement.component.html',
    styleUrls: ['./see-classement.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        NgClass,
        MarkdownComponent,
        MagmaNgInitDirective,
        MagmaTooltipDirective,
        NgxMoveableComponent,
        ZoneAreaComponent,
        ZoneAxisComponent,
        TranslocoPipe,
        MagmaInput,
        MagmaInputElement,
        MagmaInputSelect,
        MagmaInputCheckbox,
        MagmaContextMenu,
    ],
})
export class SeeClassementComponent implements OnInit, OnDestroy {
    // inject

    private readonly globalService = inject(GlobalService);
    private readonly dataService = inject<DataService<ItemSelection, { checkChoice: string }>>(DataService);
    private readonly cd = inject(ChangeDetectorRef);
    private readonly prefs = inject(PreferencesService);
    private readonly translate = inject(TranslocoService);
    private readonly router = inject(Router);

    // input

    readonly groups = input.required<FormattedGroup[]>();
    readonly list = input.required<FileType[]>();
    readonly imagesCache = input<Record<string, string | ArrayBuffer | null>>({});
    readonly id = input.required<string>();

    readonly options = input.required<Options>();

    readonly link = input<string>();

    readonly withAnnotation = input<boolean, any>(false, { transform: booleanAttribute });
    readonly render = input<boolean, any>(false, { transform: booleanAttribute });
    readonly demo = input<boolean, any>(false, { transform: booleanAttribute });

    /** Route segments for the bingo shuffle button, without the seed: e.g. ['navigate','view','<id>','bingo'] */
    readonly bingoRoute = input<string[]>();

    /** When set, tiles in bingo mode are shuffled with this seed (center preserved on odd grids) */
    readonly bingoSeed = input<number>();

    // computed

    /** Storage key: includes seed so each shuffled bingo has its own independent state */
    readonly effectiveId = computed(() => {
        const seed = this.bingoSeed();
        return seed != null ? `${this.id()}:bingo:${seed}` : this.id();
    });

    /** Groups with bingo tiles re-ordered according to `bingoSeed`, if provided */
    readonly effectiveGroups = computed(() => {
        const seed = this.bingoSeed();
        const grps = this.groups();
        if (seed != null && this.options().mode === 'bingo') {
            return Utils.applyBingoSeed(grps, seed);
        }
        return grps;
    });

    // template

    color = color;

    nameOpacity!: number;

    checkChoices: Select2Option[] = [
        { value: 'A', label: 'check.round' },
        { value: 'B', label: 'check' },
        { value: 'C', label: 'circle' },
        { value: 'D', label: 'hanamaru' },
        { value: 'E', label: 'heart' },
        { value: 'Z', label: 'emoji' },
    ];
    checkChoice = 'A';

    emojis = emojis;
    editMode = false;
    emojiDefault = '🥰';

    contextMenuBingo: ContextMenuItem<{ item: FileType; groupIndex: number; index: number }>[] = [];

    private sub = Subscriptions.instance();

    constructor() {
        this.sub.push(
            this.prefs.onChange.subscribe(() => {
                this.getContextMenu();
            }),
        );
    }

    async ngOnInit() {
        this.globalService.updateVarCss(this.options(), this.imagesCache());

        const mode = this.options().mode;

        if (mode === 'bingo') {
            await this.dataService.init(mode, this.effectiveId());
            const options = this.dataService.getOptions(mode, this.effectiveId());
            if (options) {
                this.updateHelp(options);
            }
        }

        if (this.render()) {
            this.sub.push(
                this.dataService.onOptionChange.subscribe(options => {
                    if (options && this.checkChoice !== options.checkChoice) {
                        this.updateHelp(options);
                    }
                }),
                this.dataService.onChange.subscribe(() => {
                    this.detectChanges();
                }),
            );
        }

        this.getContextMenu();
    }

    ngOnDestroy() {
        this.sub.clear();
        this.globalService.changeHelpComponent();
    }

    updateHelp(options: { checkChoice: string }) {
        this.checkChoice = options.checkChoice;
        if (options.checkChoice === 'Z') {
            this.globalService.changeHelpComponent(HelpBingoEmojiComponent);
        } else {
            this.globalService.changeHelpComponent();
        }
        this.detectChanges();
    }

    openBingo() {
        const route = this.bingoRoute();
        if (!route?.length) return;
        const seed = Math.floor(Math.random() * 2_147_483_647);
        this.router.navigate([...route, seed]);
    }

    updateIconStyle(type: unknown) {
        this.dataService.saveOption('bingo', this.effectiveId(), { checkChoice: type as string });
    }

    bingoToggleCheck(group: number, item: number) {
        var toggle = this.bingoValue(group, item);
        toggle.visible = !toggle.visible;
        toggle.content ??= this.emojiDefault;
        return this.dataService.change('bingo', this.effectiveId(), group, item, toggle);
    }

    bingoRemoveCheck(group: number, item: number) {
        var falsy = this.bingoValue(group, item);
        falsy.visible = false;
        return this.dataService.change('bingo', this.effectiveId(), group, item, falsy);
    }

    bingoSetCheck(group: number, item: number, value: ItemSelection) {
        return this.dataService.change('bingo', this.effectiveId(), group, item, value);
    }

    bingoValue(group: number, item: number) {
        let value = this.dataService.value('bingo', this.effectiveId(), group, item);
        return (value as any) === true
            ? { visible: true, transform: defaultTransform, content: this.emojiDefault }
            : (this.dataService.value('bingo', this.effectiveId(), group, item) ?? {
                  visible: false,
                  transform: defaultTransform,
              });
    }

    bingoClear() {
        this.dataService.clear('bingo', this.effectiveId());
    }

    bingoTransform(group: number, item: number, value: ItemSelection, event: string) {
        value.transform = event;
        this.dataService.change('bingo', this.effectiveId(), group, item, this.bingoValue(group, item));
    }

    async getContextMenu() {
        const initPreferences = await this.prefs.init();
        this.emojiDefault = initPreferences.emojiList[0];

        this.contextMenuBingo = [
            {
                iconText: '',
                label: this.translate.translate('preferences.emoji.remove'),
                action: data => {
                    this.bingoRemoveCheck(data.groupIndex, data.index);
                },
            },
            ...initPreferences.emojiList.map(emoji => ({
                iconText: emoji,
                action: (data: { groupIndex: number; index: number }) => {
                    const value = this.bingoValue(data.groupIndex, data.index);
                    value.content = emoji;
                    value.visible = true;
                    this.bingoSetCheck(data.groupIndex, data.index, value);
                },
            })),
            {
                iconText: '⋯',
                label: this.translate.translate('preferences.emoji.edit.list'),
                action: _ => {
                    this.selectEmoji();
                },
            },
        ];
    }

    selectEmoji() {
        this.prefs.openPanel('emoji');
    }

    detectChanges() {
        this.cd.detectChanges();
    }

    markForCheck() {
        this.cd.markForCheck();
    }

    calcWidth(item: FileString, element: HTMLElement | null) {
        // hack for calcule de width of the image
        Utils.calcWidth(this.options(), item, element);
        return true;
    }
}
