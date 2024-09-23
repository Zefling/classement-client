import { NgClass } from '@angular/common';
import {
    Component,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    booleanAttribute,
    inject,
    input,
    model,
    signal,
    viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslocoPipe } from '@jsverse/transloco';

import Ajv, { DefinedError } from 'ajv';
import { Buffer } from 'buffer';
import { Select2, Select2Data, Select2Module, Select2Option } from 'ng-select2-component';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ThemeIconComponent } from 'src/app/components/theme-icon/theme-icon.component';
import { Category, FileHandle, ImagesNames, ModeNames, Options, Theme, ThemesNames } from 'src/app/interface/interface';
import { CategoriesService } from 'src/app/services/categories.service';
import { GlobalService, TypeFile, typesMine } from 'src/app/services/global.service';
import { MemoryService } from 'src/app/services/memory.service';
import { OptimiseImageService } from 'src/app/services/optimise-image.service';
import { palette } from 'src/app/tools/function';
import { Subscriptions } from 'src/app/tools/subscriptions';
import { Utils } from 'src/app/tools/utils';
import { environment } from 'src/environments/environment';

import {
    defaultGroup,
    imageInfos,
    imagesAxis,
    imagesBingo,
    imagesIceberg,
    imagesLists,
    imagesThemes,
    listModes,
    themes,
    themesAxis,
    themesBingo,
    themesIceberg,
    themesList,
    themesLists,
} from './classement-default';
import { ClassementEditComponent } from './classement-edit.component';
import { groupExample } from './classement-options';
import { schemaTheme } from './classement-schemas';
import { ClassementThemesManagerComponent } from './classement-themes-manager.component';
import { ClassementThemesComponent } from './classement-themes.component';

import { SeeClassementComponent } from '../../components/see-classement/see-classement.component';
import { TagListComponent } from '../../components/tag-list/tag-list.component';
import { DropImageDirective } from '../../directives/drop-image.directive';
import { TextareaAutosizeDirective } from '../../directives/textarea-autosize.directive';
import { TooltipDirective } from '../../directives/tooltip.directive';

@Component({
    selector: 'classement-options',
    templateUrl: './classement-options.component.html',
    styleUrls: ['./classement-options.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        Select2Module,
        NgClass,
        TextareaAutosizeDirective,
        TooltipDirective,
        TagListComponent,
        ClassementThemesComponent,
        DialogComponent,
        DropImageDirective,
        SeeClassementComponent,
        TranslocoPipe,
        ThemeIconComponent,
        ClassementThemesManagerComponent,
    ],
})
export class ClassementOptionsComponent implements OnInit, OnChanges, OnDestroy {
    // inject

    private readonly optimiseImage = inject(OptimiseImageService);
    private readonly categories = inject(CategoriesService);
    private readonly memory = inject(MemoryService);
    private readonly editor = inject(ClassementEditComponent, { host: true });
    private readonly globalService = inject(GlobalService);

    // input

    options = model.required<Options>();
    lockCategory = input<boolean, any>(false, { transform: booleanAttribute });

    // viewChild

    classementThemes = viewChild.required(ClassementThemesComponent);
    dialogChangeMode = viewChild.required<DialogComponent>('dialogChangeMode');
    dialogAdvancedOptions = viewChild.required<DialogComponent>('dialogAdvancedOptions');
    dialogAdvancedOptionsExport = viewChild.required<DialogComponent>('exportDialog');
    dialogAdvancedOptionsImport = viewChild.required<DialogComponent>('importDialog');
    themesManager = viewChild.required(ClassementThemesManagerComponent);
    mode = viewChild.required<Select2>('mode');

    // template

    api = environment.api?.active || false;
    groupExample = groupExample;

    categoriesList: Category[] = [];

    listThemes!: Select2Data;
    themes!: Theme[];

    imagesList: ImagesNames[] = imagesThemes;
    themesList: ThemesNames[] = themes;

    zoneMode: ModeNames[] = ['iceberg', 'axis'];

    listMode: Select2Data = listModes;

    _modeTemp?: ModeNames;
    _previousMode?: ModeNames;

    themeTmp?: Theme<string>;
    themeError = false;
    themeCurrent = signal<Theme<string> | undefined>(undefined);

    protected replacePattern = /default|teams/;

    private _sub = Subscriptions.instance();

    constructor() {
        this.categoryUpdate();
        this._sub.push(
            this.categories.onChange.subscribe(() => {
                this.categoryUpdate();
            }),
            this.globalService.onOptionChange.subscribe(() => {
                this.updateCurrentTheme();
            }),
        );
    }

    ngOnInit(): void {
        this.updateMode();
        this.updateCurrentTheme();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['options']) {
            this._modeTemp = undefined;
            this.updateMode();
        }
    }

    updateCurrentTheme() {
        this.themeCurrent.set({ id: '', name: 'custom', options: this.options() });
    }

    updateMode() {
        const options = this.options();
        if (options) {
            const mode = this._modeTemp ?? options.mode ?? 'default';

            switch (mode) {
                case 'iceberg':
                    this.imagesList = imagesIceberg;
                    this.themesList = themesIceberg;
                    break;
                case 'axis':
                    this.imagesList = imagesAxis;
                    this.themesList = themesAxis;
                    break;
                case 'bingo':
                    this.imagesList = imagesBingo;
                    this.themesList = themesBingo;
                    break;
                default:
                    this.imagesList = imagesLists;
                    this.themesList = themesLists;
                    break;
            }
            if (!this._modeTemp || options.mode !== mode) {
                this.updateList(mode);
            }

            this.themes = themesList.filter(e => this.themesList.includes(e.name));
        }
    }

    updateList(mode: ModeNames = this._modeTemp ?? this.options()?.mode ?? 'default') {
        // list image
        this.listThemes = this.imagesList.map<Select2Option>(e => ({
            value: e,
            label: e,
            data: {
                image: this.getImageUrl(e),
                label: e,
            },
        }));
        const options = this.options();
        if (options) {
            let modeType = mode;
            switch (mode) {
                case 'default':
                    modeType = 'default';
                    this.updateAction('groups', defaultGroup);
                    break;
                case 'teams':
                    modeType = 'default';
                    this.updateAction('groups', defaultGroup);
                    break;
                case 'axis':
                case 'iceberg':
                    this.updateAction('groups', [{ name: mode, bgColor: '#000', txtColor: '#000', list: [] }]);
                    break;
                case 'bingo':
                    this.updateAction('sizeX', options.sizeX ?? 5);
                    this.updateAction('sizeY', options.sizeY ?? 5);
                    break;
            }

            // list theme
            const themeOption = themesList.find(e => e.name === this.themesList[0]);
            if (themeOption && this._previousMode && this._previousMode !== modeType) {
                this.changeTheme(themeOption);
            }
            // select mode
            options.mode = mode;

            // fix ids
            this.editor.addIds();
        }
    }

    protected updateAction(action: string, value: any) {
        if (action === 'groups') {
            this.editor.groups = Utils.jsonCopy(value);
        } else if (action === 'sizeX') {
            if (this.editor.groups[0].list.length < value) {
                this.editor.groupsControl(this.editor.groups, this.editor.options);
            } else if (this.editor.groups[0].list.length > value) {
                this.editor.groups.forEach(line =>
                    line.list.splice(value).forEach(tile => {
                        if (tile) {
                            this.editor.list.push(tile);
                        }
                    }),
                );
            }
        } else if (action === 'sizeY') {
            if (this.editor.groups.length < value) {
                this.editor.groupsControl(this.editor.groups, this.editor.options);
            } else if (this.editor.groups.length > value) {
                this.editor.groups.splice(value).forEach(line => {
                    line.list.forEach(tile => {
                        if (tile) {
                            this.editor.list.push(tile);
                        }
                    });
                });
            }
        }
    }

    updateListGroup(size: number) {
        if (!(size >= 0 && size <= 20)) {
            size = size >= 0 ? 20 : 1;
        }
        const options = this.options()!;
        if (!options.groups) {
            options.groups = [];
        }
        if (size < options.groups.length) {
            options.groups.splice(size, options.groups.length);
        } else if (size > options.groups.length) {
            for (let i = 0; i < size - options.groups.length; i++) {
                options.groups.push({ title: '' });
            }
        }
    }

    ngOnDestroy(): void {
        this._sub.clear();
    }

    modeChange(previous: ModeNames, event: ModeNames) {
        if (this._previousMode && previous !== event) {
            this.dialogChangeMode().open();
        }
        this._previousMode = previous;
        this._modeTemp = event;
    }

    modeChangeValid(ok: boolean) {
        if (ok) {
            this.memory.reset();
            this.editor.reset();
            this.updateMode();
            this.editor.helpInit();
            this.options()!.itemHeightAuto = this.zoneMode.includes(this._modeTemp!);
        } else {
            this.mode().writeValue(this._previousMode!);
        }
        this.dialogChangeMode().close();
    }

    advanceOptions() {
        this.dialogAdvancedOptions().open();
    }

    updateTags(tags: string[]) {
        const options = this.options();
        if (options) {
            options.tags = tags;
        }
    }

    themesOpen() {
        this.classementThemes().dialog()!.open();
    }

    changeTheme(theme: Theme) {
        const options = this.options()!;
        const mode = options.mode;
        Object.assign(
            options,
            theme.options,
            {
                title: options.title,
                category: options.category,
                autoSave: options.autoSave,
                streamMode: options.streamMode,
            },
            { mode },
        );

        if (options.palette) {
            const colors = palette(options.palette, this.editor.groups.length);
            console.log(colors);
            this.editor.groups.forEach((group, index) => {
                group.bgColor = colors[index];
            });
            delete options.palette;
        }
    }

    changeCustomBackground(event: string | FileHandle) {
        if ((event as FileHandle).target) {
            this.updateImageBackgroundCustom((event as FileHandle).target?.result as string);
            this.updateMode();
        }
    }

    changeCustomBackgroundEvent(event: Event) {
        const files = (event.target as any).files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (typesMine['image'].includes(file.type)) {
                const data: FileHandle = {
                    file,
                };

                let reader = new FileReader();
                reader.onload = (ev: ProgressEvent<FileReader>) => {
                    data.target = ev.target;
                };
                reader.onloadend = (_ev: ProgressEvent<FileReader>) => {
                    this.updateImageBackgroundCustom(String(data.target?.result));
                };
                reader.readAsDataURL(data.file);
            }
        }
    }

    resetItemTextBackground() {
        const options = this.options()!;
        options.itemTextBackgroundColor = '';
        options.itemTextBackgroundOpacity = 100;
    }

    resetItemBackground() {
        const options = this.options()!;
        options.itemBackgroundColor = '';
        options.itemBackgroundOpacity = 100;
    }

    resetLineBackground() {
        const options = this.options()!;
        options.lineBackgroundColor = '';
        options.lineBackgroundOpacity = 100;
    }

    resetLineBorder() {
        const options = this.options()!;
        options.lineBorderColor = '';
        options.lineBorderOpacity = 100;
    }

    resetItemBorder() {
        const options = this.options()!;
        options.itemBorderColor = '';
        options.itemBorderOpacity = 100;
    }

    resetItemText() {
        const options = this.options()!;
        options.itemTextColor = '';
        options.itemTextOpacity = 100;
    }

    resetTitleText() {
        const options = this.options()!;
        options.titleTextColor = '';
        options.titleTextOpacity = 100;
    }

    resetAxisLine() {
        const options = this.options()!;
        options.axisLineColor = '';
        options.axisLineOpacity = 100;
    }

    updateSize(axis: 'itemHeight' | 'itemWidth' | 'itemMaxHeight' | 'itemMaxWidth', min: number) {
        const options = this.options()!;
        if (options[axis] < min) {
            options[axis] = min;
        } else if (options[axis] > 300) {
            options[axis] = 300;
        }
    }

    importJsonFile(event: Event) {
        const files = (event.target as any).files as FileList;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (typesMine[TypeFile.json].includes(file.type)) {
                const data: FileHandle = {
                    file,
                };

                let reader = new FileReader();
                reader.onload = (ev: ProgressEvent<FileReader>) => {
                    data.target = ev.target;
                };
                reader.onloadend = (_ev: ProgressEvent<FileReader>) => {
                    const url = data.target?.result as String;
                    const fileString = url?.replace('data:application/json;base64,', '')?.replace('data:base64,', '');
                    const importOptions = JSON.parse(
                        Buffer.from(fileString!, 'base64').toString('utf-8'),
                    ) as Theme<string>;

                    const ajv = new Ajv({
                        logger: {
                            log: args => {
                                console.log(args);
                            },
                            warn: args => {
                                console.log(args);
                            },
                            error: args => {
                                console.log(args);
                            },
                        },
                    });
                    const validate = ajv.compile(schemaTheme);
                    const valid = validate(importOptions);

                    if (valid) {
                        this.themeTmp = importOptions;
                        this.themeError = false;
                    } else {
                        this.themeError = true;

                        for (const err of validate.errors as DefinedError[]) {
                            console.log(err);
                        }
                    }
                };
                reader.readAsDataURL(data.file);
            }
        }
    }

    importValidation() {
        const options = this.options();
        if (options && this.themeTmp) {
            Object.assign(options, this.themeTmp.options);
            this.importCancel();
        }
    }

    importCancel() {
        this.themeTmp = undefined;
        this.dialogAdvancedOptionsImport().close();
    }

    private getImageUrl(item: ImagesNames) {
        switch (item) {
            case 'none':
                return null;
            case 'custom':
                return this.options ? `url(${this.options()!.imageBackgroundCustom})` : 'none';
            default:
                return `url(./assets/themes/${imageInfos[item]!.mini})`;
        }
    }

    private categoryUpdate() {
        this.categoriesList = this.categories.categoriesList;
    }

    private updateImageBackgroundCustom(image: string) {
        this.optimiseImage
            .resize(
                {
                    id: `tile-${Utils.randomNumber()}`,
                    url: image,
                    name: 'background',
                    size: image.length,
                    realSize: image.length,
                    type: 'image',
                    date: 0,
                },
                1000,
                1000,
            )
            .then(file => {
                this.options()!.imageBackgroundCustom = file.reduceFile?.url || file.sourceFile.type;
                this.updateList();
            });
    }
}
