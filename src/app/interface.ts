import { FileHandle } from './directives/drop-image.directive';


export type FileString = { url?: string; name: string };
export type FormatedGroup = { name: string; bgColor: string; txtColor: string; list: FileString[] };
export type Group = { name: string; bgColor: string; txtColor: string; list: FileHandle[] };
export type Category = { value: string; label: string };

export interface Data {
    options: {
        title: string;
        category: string;
        itemWidth: number;
        itemHeight: number;
        itemPadding: number;
    };
    id?: string;
    groups: Group[];
    list: FileHandle[];
}

export interface FormatedData {
    options: {
        title: string;
        category: string;
        itemWidth: number;
        itemHeight: number;
        itemPadding: number;
    };
    id?: string;
    date: string;
    groups: FormatedGroup[];
    list: FileString[];
}
