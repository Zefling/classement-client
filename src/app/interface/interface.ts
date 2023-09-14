import { TypeFile } from '../services/global.service';

export interface Classement {
    banner: string;
    data: Data;
    category: string;
    mode: string;
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
}

export interface ClassementHistory {
    id?: number;
    date?: Date;
    name?: string;
}

export interface User {
    classements?: Classement[];
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
export type FileString = {
    id?: string;
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
};
export type GroupOption = { group: FormattedGroup; indexGrp: number; first: boolean; last: boolean };
export type FormattedGroup = { name: string; bgColor: string; txtColor: string; list: FileString[] };
export type Group = { name: string; bgColor: string; txtColor: string; list: FileHandle[] };
export type Category = { value: string; label: string };
export type Options = ThemeOptions & {
    showAdvancedOptions: boolean;
    title: string;
    category: string;
    description: string;
    tags: string[];
    mode: ModeNames;
};
export type ThemeOptions = {
    titleTextColor: string;
    titleTextOpacity: number;
    itemWidth: number;
    itemWidthAuto: boolean;
    itemHeight: number;
    itemPadding: number;
    itemBorder: number;
    itemMargin: number;
    itemBackgroundColor: string;
    itemBorderColor: string;
    itemBackgroundOpacity: number;
    itemBorderOpacity: number;
    itemTextColor: string;
    itemTextOpacity: number;
    itemTextPosition: 'hidden' | 'bottom' | 'bottom-over' | 'bottom-over-hover' | 'top' | 'top-over' | 'top-over-hover';
    itemTextBackgroundColor: string;
    itemTextBackgroundOpacity: number;
    lineBackgroundColor: string;
    lineBorderColor: string;
    lineBackgroundOpacity: number;
    lineBorderOpacity: number;
    imageBackgroundColor: string;
    imageBackgroundImage: string;
    imageBackgroundCustom: string;
    imageWidth: number;
    nameWidth: number;
    nameFontSize: number;
    nameBackgroundOpacity: number;
    nameMarkdown: boolean;
    direction: 'ltr' | 'rtl';
    autoSave?: boolean;
    streamMode?: boolean;
};

export type Theme = {
    name: ThemeNames;
    options: Options;
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
    list: FileString[];
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
    groupsLenght: number;
    listLenght: number;
}

export interface FormattedData extends IndexedData<any> {
    groups: FormattedGroup[];
    list: FileString[];
}

export interface FormattedInfosData {
    update: boolean;
    infos: FormattedInfos;
    data: FormattedData;
}

export type ScreenMode = 'default' | 'enlarge' | 'fullscreen';

export type PreferenceInterfaceTheme = 'dark' | 'light';
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
    theme: ThemeNames;
    pageSize: number;
    authApiKeys: {
        imdb: string;
    };
}

export type OptimisedFile = { sourceFile: FileString; reduceFile?: FileString; reduce: number };

export type ThemeNames = 'default' | 'compact' | 'sakura' | 'night' | 'ciel';

export type ModeNames = 'default' | 'teams';

// sort
export type SortUserCol = 'username' | 'dateCreate';
export type SortClassementCol = 'name' | 'category' | 'dateCreate';
export type SortDirection = 'ASC' | 'DESC';

export type ImageCache = Record<string, string | ArrayBuffer | null>;
