import { ChangeDetectorRef, Component, DoCheck, OnDestroy, OnInit, booleanAttribute, input } from '@angular/core';

import { Subject, debounceTime } from 'rxjs';

import { FileString, FileType, FormattedGroup, Options } from 'src/app/interface/interface';
import { Utils } from 'src/app/tools/utils';

import { TranslocoService } from '@jsverse/transloco';
import { Select2Option, Select2UpdateEvent, Select2UpdateValue } from 'ng-select2-component';
import { HelpBingoEmojiComponent } from 'src/app/content/navigate/help/help.bingo.component';
import { DataService } from 'src/app/services/data.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { emojis } from 'src/app/tools/emoji';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { GlobalService } from '../../services/global.service';
import { ContextMenuItem } from '../context-menu/context-menu.component';

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
})
export class SeeClassementComponent implements OnInit, OnDestroy, DoCheck {
    groups = input.required<FormattedGroup[]>();
    list = input.required<FileType[]>();
    imagesCache = input<Record<string, string | ArrayBuffer | null>>({});
    id = input.required<string>();

    options = input.required<Options>();

    link = input<string>();

    withAnnotation = input<boolean, any>(false, { transform: booleanAttribute });
    render = input<boolean, any>(false, { transform: booleanAttribute });
    demo = input<boolean, any>(false, { transform: booleanAttribute });

    nameOpacity!: string;

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

    private _detectChange = new Subject<void>();

    private sub = Subscriptions.instance();

    constructor(
        private readonly globalService: GlobalService,
        private readonly dataService: DataService<ItemSelection, { checkChoice: string }>,
        private readonly cd: ChangeDetectorRef,
        private readonly prefs: PreferencesService,
        private readonly translate: TranslocoService,
    ) {
        this._detectChange.pipe(debounceTime(10)).subscribe(() => {
            this.cd.detectChanges();
        });

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
            await this.dataService.init(mode, this.id());
            const options = this.dataService.getOptions(mode, this.id());
            if (options) {
                this.checkChoice = options.checkChoice;
                if (options.checkChoice === 'Z') {
                    this.globalService.changeHelpComponent(HelpBingoEmojiComponent);
                } else {
                    this.globalService.changeHelpComponent();
                }
                this.cd.detectChanges();
            }
        }

        if (this.render()) {
            this.sub.push(
                this.dataService.onOptionChange.subscribe(options => {
                    if (options && this.checkChoice !== options.checkChoice) {
                        this.checkChoice = options.checkChoice;
                        if (options.checkChoice === 'Z') {
                            this.globalService.changeHelpComponent(HelpBingoEmojiComponent);
                        } else {
                            this.globalService.changeHelpComponent();
                        }
                        this.cd.detectChanges();
                    }
                }),
            );
        }

        this.getContextMenu();
    }

    ngDoCheck(): void {
        this.nameOpacity = this.globalService.getValuesFromOptions(this.options()).nameOpacity;
    }

    ngOnDestroy() {
        this.sub.clear();
    }

    updateIconStyle(type: Select2UpdateEvent<Select2UpdateValue>) {
        this.dataService.saveOption('bingo', this.id(), { checkChoice: type.value as string });
    }

    bingoToggleCheck(group: number, item: number) {
        var toggle = this.bingoValue(group, item);
        toggle.visible = !toggle.visible;
        toggle.content ??= this.emojiDefault;
        return this.dataService.change('bingo', this.id(), group, item, toggle);
    }

    bingoRemoveCheck(group: number, item: number) {
        var falsy = this.bingoValue(group, item);
        falsy.visible = false;
        return this.dataService.change('bingo', this.id(), group, item, falsy);
    }

    bingoSetCheck(group: number, item: number, value: ItemSelection) {
        return this.dataService.change('bingo', this.id(), group, item, value);
    }

    bingoValue(group: number, item: number) {
        let value = this.dataService.value('bingo', this.id(), group, item);
        return (value as any) === true
            ? { visible: true, transform: defaultTransform, content: this.emojiDefault }
            : (this.dataService.value('bingo', this.id(), group, item) ?? {
                  visible: false,
                  transform: defaultTransform,
              });
    }

    bingoClear() {
        this.dataService.clear('bingo', this.id());
    }

    bingoTransform(group: number, item: number, value: ItemSelection, event: string) {
        value.transform = event;
        return this.dataService.change('bingo', this.id(), group, item, this.bingoValue(group, item));
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
                    value.transform = defaultTransform;
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
        this._detectChange.next();
    }

    calcWidth(item: FileString, element: HTMLElement | null) {
        // hack for calcule de width of the image
        Utils.calcWidth(this.options(), item, element);
        return true;
    }
}
