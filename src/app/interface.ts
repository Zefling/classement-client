import { TypeFile } from './services/global.service';


export interface Classement {
    banner: string;
    data: Data;
    category: string;
    name: string;
    user: string;
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
    // status
    hidden?: boolean;
    deleted?: boolean;
    parent?: boolean;
}

export interface User {
    classements: Classement[];
    dateCreate: Date;
    id: number;
    username: string;
    roles: string[];
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
};
export type FormatedGroup = { name: string; bgColor: string; txtColor: string; list: FileString[] };
export type Group = { name: string; bgColor: string; txtColor: string; list: FileHandle[] };
export type Category = { value: string; label: string };
export type Options = ThemeOptions & {
    showAdvancedOptions: boolean;
    title: string;
    category: string;
};
export type ThemeOptions = {
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
    itemTextPosition: 'bottom' | 'bottom-over' | 'top' | 'top-over';
    itemTextBackgroundColor: string;
    itemTextBackgroundOpacity: number;
    lineBackgroundColor: string;
    lineBorderColor: string;
    lineBackgroundOpacity: number;
    lineBorderOpacity: number;
    imageBackgroundColor: string;
    imageBackgroundImage: string;
    imageWidth: number;
    nameWidth: number;
    nameFontSize: number;
    nameBackgroundOpacity: number;
    autoSave?: boolean;
};

export type Theme = {
    name: string;
    options: ThemeOptions;
};

export interface IndexedData {
    id?: string;
    /** server link */
    rankingId?: string | null;
    templateId?: string | null;
    parentId?: string | null;
}

export interface Data extends IndexedData {
    options: Options;
    groups: FormatedGroup[];
    list: FileString[];
}

export interface FormatedInfos extends IndexedData {
    options: Options;
    date: string | Date;
    groupsLenght: number;
    listLenght: number;
}

export interface FormatedData extends IndexedData {
    groups: FormatedGroup[];
    list: FileString[];
}

export interface FormatedInfosData {
    infos: FormatedInfos;
    data: FormatedData;
}

export type OptimisedFile = { sourceFile: FileString; reduceFile?: FileString; reduce: number };
