import { FormatedGroup, Options, Theme } from 'src/app/interface';


export const defautGroup: FormatedGroup[] = [
    { name: 'S', bgColor: '#dc8add', txtColor: '#000000', list: [] },
    { name: 'A', bgColor: '#f66151', txtColor: '#000000', list: [] },
    { name: 'B', bgColor: '#ffbe6f', txtColor: '#000000', list: [] },
    { name: 'C', bgColor: '#f9f06b', txtColor: '#000000', list: [] },
    { name: 'D', bgColor: '#8ff0a4', txtColor: '#000000', list: [] },
    { name: 'E', bgColor: '#99c1f1', txtColor: '#000000', list: [] },
];

export const defaultOptions: Options = {
    showAdvancedOptions: false,
    title: '',
    category: '',
    itemWidth: 100,
    itemHeight: 100,
    itemPadding: 10,
    itemBorder: 1,
    itemMargin: 2,
    itemBackgroundColor: '',
    itemBorderColor: '',
    lineBackgroundColor: '',
    lineBorderColor: '',
    itemBackgroundOpacity: 100,
    itemBorderOpacity: 100,
    lineBackgroundOpacity: 100,
    lineBorderOpacity: 100,
    imageBackgroundColor: '',
    imageWidth: 1170,
    nameWidth: 150,
    nameFontSize: 120,
};

export const themesList: Theme[] = [
    {
        name: 'default',
        options: defaultOptions,
    },
    {
        name: 'compact',
        options: {
            ...defaultOptions,
            itemWidth: 80,
            itemHeight: 100,
            itemPadding: 0,
            itemBorder: 0,
            itemMargin: 0,
            imageWidth: 1170,
            nameWidth: 100,
            nameFontSize: 100,
        },
    },
    {
        name: 'sakura',
        options: {
            itemWidth: 100,
            itemHeight: 100,
            itemPadding: 10,
            itemBorder: 1,
            itemMargin: 2,
            itemBackgroundColor: '#f66151',
            itemBorderColor: '#ed333b',
            lineBackgroundColor: '#f39d9d',
            lineBorderColor: '#e97697',
            itemBackgroundOpacity: 40,
            itemBorderOpacity: 30,
            lineBackgroundOpacity: 100,
            lineBorderOpacity: 95,
            imageBackgroundColor: '#e1b6b6',
            imageWidth: 1170,
            nameWidth: 150,
            nameFontSize: 120,
        },
    },
];

export const categories: String[] = [
    'anime',
    'game',
    'video.game',
    'board.game',
    'movie',
    'series',
    'vehicle',
    'other',
];
