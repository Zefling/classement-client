import { TypeFile } from './services/global.service';

export interface Classement {
    banner: string;
    data: Data;
    category: string;
    name: string;
    user: string;
    userAvatar: string;
    // ids
    rankingId: string;
    templateId: string;
    parentId: string;
    localId: string;
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
};
export type GroupOption = { group: FormatedGroup; indexGrp: number; first: boolean; last: boolean };
export type FormatedGroup = { name: string; bgColor: string; txtColor: string; list: FileString[] };
export type Group = { name: string; bgColor: string; txtColor: string; list: FileHandle[] };
export type Category = { value: string; label: string };
export type Options = ThemeOptions & {
    showAdvancedOptions: boolean;
    title: string;
    category: string;
    description: string;
    tags: string[];
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
    itemTextPosition: 'bottom' | 'bottom-over' | 'top' | 'top-over';
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
    autoSave?: boolean;
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
    banner?: string;
    dateCreate?: string;
    dateChange?: string;
}

export interface Data extends IndexedData<any> {
    options: Options;
    groups: FormatedGroup[];
    list: FileString[];
}

export interface importData {
    data?: Data;
    error?: boolean;
    selected?: boolean;
}

export interface FormatedInfos extends IndexedData<any> {
    options: Options;
    /**
     * @deprecated use dateCreate
     */
    date?: string | Date;
    groupsLenght: number;
    listLenght: number;
}

export interface FormatedData extends IndexedData<any> {
    groups: FormatedGroup[];
    list: FileString[];
}

export interface FormatedInfosData {
    update: boolean;
    infos: FormatedInfos;
    data: FormatedData;
}

export interface PreferencesData {
    nameCopy: boolean;
    newColor: 'mixed' | 'same';
    newLine: 'below' | 'above' | 'ask-me';
    lineOption: 'auto' | 'reduce';
    theme: ThemeNames;
}

export type OptimisedFile = { sourceFile: FileString; reduceFile?: FileString; reduce: number };

export type ThemeNames = 'default' | 'compact' | 'sakura' | 'night' | 'ciel';

// sort
export type SortUserCol = 'username' | 'dateCreate';
export type SortClassementCol = 'name' | 'category' | 'dateCreate';
export type SortDirection = 'ASC' | 'DESC';
