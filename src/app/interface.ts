import { FileHandle } from './directives/drop-image.directive';


export type FileString = { url?: string; name: string; size: number; realSize: number; type: string; date: number };
export type FormatedGroup = { name: string; bgColor: string; txtColor: string; list: FileString[] };
export type Group = { name: string; bgColor: string; txtColor: string; list: FileHandle[] };
export type Category = { value: string; label: string };

export interface IndexedData {
    id?: string;
}

export interface Data extends IndexedData {
    options: {
        title: string;
        category: string;
        itemWidth: number;
        itemHeight: number;
        itemPadding: number;
    };
    groups: FormatedGroup[];
    list: FileString[];
}

export interface FormatedInfos extends IndexedData {
    options: {
        title: string;
        category: string;
        itemWidth: number;
        itemHeight: number;
        itemPadding: number;
    };
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
