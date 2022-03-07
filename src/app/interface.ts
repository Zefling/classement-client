import { FileHandle } from './directives/drop-image.directive';


export type FileString = { url?: string; name: string; size: number; realSize: number; type: string; date: number };
export type FormatedGroup = { name: string; bgColor: string; txtColor: string; list: FileString[] };
export type Group = { name: string; bgColor: string; txtColor: string; list: FileHandle[] };
export type Category = { value: string; label: string };
export type Options = {
    title: string;
    category: string;
    itemWidth: number;
    itemHeight: number;
    itemPadding: number;
    itemBorder: number;
    itemMargin: number;
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
