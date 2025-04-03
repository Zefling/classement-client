import { PreferenceInterfaceTheme } from '@ikilote/magma';

import { TypeFile } from '../services/global.service';

export interface Classement {
    banner: string;
    data: Data;
    category: string;
    mode: 'default' | 'teams' | 'axis' | 'iceberg' | 'bingo';
    name: string;
    user: string;
    userAvatar: string;
    // ids
    rankingId: string;
    templateId: string;
    parentId: string;
    localId: string;
    linkId: string;
    // date
    dateCreate: Date;
    dateChange: Date;
    // items count
    totalGroups: number;
    totalItems: number;
    templateTotal: number;
    // status
    hidden?: boolean;
    deleted?: boolean;
    parent?: boolean;
    password?: string;
    history?: boolean;
    historyId?: string;
    withHistory?: number;
    adult?: boolean;
}

export interface ClassementHistory {
    id?: number;
    date?: Date;
    dateChange?: Date;
    dateCreate?: Date;
    name?: string;
}

export interface User {
    classements?: Classement[];
    themes?: ThemeData[];
    dateCreate: Date;
    id: number;
    username: string;
    roles: string[];
    email: string;
    avatar: boolean;
    avatarUrl?: string;
    // status
    isValidated?: boolean;
    deleted?: boolean;
}

export interface FileHandle {
    file: File;
    target?: FileReader | null;
}

export type FileStream = { filter: TypeFile; file: FileString };
export type FileType = FileString | null;
export type FileString = {
    id: string;
    url?: string;
    name: string;
    height?: number;
    width?: number;
    size: number;
    realSize: number;
    type: string;
    date: number;
    title?: string;
    annotation?: string;
    bgColor?: string;
    txtColor?: string;
    x?: number;
    y?: number;
};
export type GroupOption = { group: FormattedGroup; indexGrp: number; first: boolean; last: boolean };
export type FormattedGroup = { name: string; bgColor: string; txtColor: string; list: FileType[] };
export type Group = { name: string; bgColor: string; txtColor: string; list: FileHandle[] };
export type Category = { value: string; label: string };
export type Options = ThemeOptions & {
    title: string;
    category: string;
    description: string;
    tags: string[];
    mode: ModeNames;
    groups?: OptionGroup[];
    themeName?: string;
};
export type ThemeOptions = {
    titleTextColor: string;
    titleTextOpacity: number;
    itemWidth: number;
    itemWidthAuto: boolean;
    itemImageCover: boolean;
    itemMaxWidth: number;
    itemHeight: number;
    itemHeightAuto: boolean;
    itemMaxHeight: number;
    itemPadding: number;
    itemBorder: number;
    itemMargin: number;
    itemBackgroundColor: string;
    itemBorderColor: string;
    itemBackgroundOpacity: number;
    itemBorderOpacity: number;
    itemTextMinLine: number;
    itemTextMaxLine: number;
    itemTextSize: number;
    itemTextOnlySize: number;
    itemTextColor: string;
    itemTextOpacity: number;
    itemTextPosition:
        | 'hidden'
        | 'bottom'
        | 'bottom-over'
        | 'bottom-over-hover'
        | 'bottom-bubble'
        | 'top'
        | 'top-over'
        | 'top-over-hover'
        | 'top-bubble';
    itemTextBackgroundColor: string;
    itemTextBackgroundOpacity: number;
    lineBackgroundColor: string;
    lineBorderColor: string;
    lineBackgroundOpacity: number;
    lineBorderOpacity: number;
    imageBackgroundColor: string;
    imageBackgroundImage: ImagesNames;
    imageBackgroundCustom: string;
    imageWidth: number;
    imageHeight?: number;
    imageSize?: 'cover';
    imagePosition?: 'center';
    columnMinHeight?: number;
    axisLineWidth: number;
    axisLineColor: string;
    axisLineOpacity: number;
    axisArrowWidth: number;
    nameWidth: number;
    nameMinHeight: number;
    nameFontSize: number;
    nameBackgroundOpacity: number;
    nameMarkdown: boolean;
    borderRadius: number;
    borderSpacing: number;
    borderSize: number;
    groupLineSize: number;
    groupLineColor: string;
    groupLineOpacity: number;
    direction: 'ltr' | 'rtl';
    autoSave?: boolean;
    streamMode?: boolean;
    sizeX?: number;
    sizeY?: number;
    palette?: Palette;
    font?: string;
};
export type Palette = (string | [string, string])[];

export type OptionGroup = {
    title: string;
    titleVerticalPosition?: 'start' | 'center' | 'end';
    titleHorizontalPosition?: 'start' | 'center' | 'end';
};

export type Theme<T = ThemesNames> = {
    id: string;
    name: T;
    options: Options;
    source?: 'default' | 'local' | 'user' | 'other';
    hidden?: boolean;
    showMode?: boolean;
};

export type ThemeData = {
    name: string;
    mode: ModeNames;
    data: {
        options: Options;
    };
    dateCreate?: string;
    dateChange?: null;
    themeId?: string;
    user?: string;
    hidden?: boolean;
    deleted?: boolean;
    withHistory?: boolean;
};

export interface IndexedData<T extends any> {
    id?: string;
    data?: T;
    /** server link */
    rankingId?: string | null;
    templateId?: string | null;
    parentId?: string | null;
    linkId?: string | null;
    banner?: string;
    dateCreate?: string;
    dateChange?: string;
}

export interface Data extends IndexedData<any> {
    options: Options;
    groups: FormattedGroup[];
    list: FileType[];
}

export interface importData {
    data?: Data;
    error?: boolean;
    selected?: boolean;
}

export interface FormattedInfos extends IndexedData<any> {
    options: Options;
    /**
     * @deprecated use {@link dateCreate}
     */
    date?: string | Date;
    groupsLength: number;
    listLength: number;
    // retro compatibility
    groupsLenght?: number;
    listLenght?: number;
}

export interface FormattedData extends IndexedData<any> {
    groups: FormattedGroup[];
    list: FileType[];
}

export interface FormattedInfosData {
    update: boolean;
    infos: FormattedInfos;
    data: FormattedData;
}

export type ScreenMode = 'default' | 'enlarge' | 'fullscreen';

export type PreferenceNewColor = 'mixed' | 'same';
export type PreferenceNewLine = 'below' | 'above' | 'ask-me';
export type PreferenceLineOption = 'auto' | 'reduce' | 'hidden';

export interface PreferencesData {
    interfaceLanguage?: string;
    interfaceTheme?: PreferenceInterfaceTheme;
    nameCopy: boolean;
    newColor: PreferenceNewColor;
    newLine: PreferenceNewLine;
    lineOption: PreferenceLineOption;
    mode: ModeNames | 'choice';
    autoResize: '300×300' | '500×500' | 'origin';
    theme: ThemesNames | undefined;
    pageSize: number;
    mainMenuReduce: boolean;
    emojiList: string[];
    zoomMobile: number;
    adult: boolean;
    advancedOptions: boolean;
    advancedFork: boolean;
    authApiKeys: {
        imdb: string;
    };
}

export type OptimizedFile = { sourceFile: FileString; reduceFile?: FileString; reduce: number };

export type ThemesNames =
    | 'default'
    | 'compact'
    | 'square'
    | 'sakura'
    | 'night'
    | 'ciel'
    | 'classic'
    | 'iceberg'
    | 'axis'
    | 'bingo-s'
    | 'bingo-m'
    | 'bingo-l'
    | 'grid'
    | 'custom';
export type ImagesNames = 'none' | 'custom' | 'sakura' | 'etoile' | 'ciel' | 'iceberg' | 'axis';

export type ModeNames = 'default' | 'teams' | 'columns' | 'iceberg' | 'axis' | 'bingo';

// sort
export type SortUserCol = 'username' | 'dateCreate';
export type SortClassementCol = 'name' | 'category' | 'dateCreate';
export type SortDirection = 'ASC' | 'DESC';

export type ImageCache = Record<string, string | ArrayBuffer | null>;
