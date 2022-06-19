import { TypeFile } from './services/global.service';


export interface User {
    classements: {
        banner: string;
        data: Data;
        groupName: string;
        name: string;
        rankingId: string;
        templateId: string;
        dateCreate: Date;
        dateChange: Date;
    }[];
    dateCreate: Date;
    id: number;
    username: string;
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
};

export type Theme = {
    name: string;
    options: ThemeOptions;
};

export interface IndexedData {
    id?: string;
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
