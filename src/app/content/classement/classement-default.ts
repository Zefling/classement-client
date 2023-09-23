import { FormattedGroup, Options, Theme, ThemeNames } from 'src/app/interface/interface';

export const defautGroup: FormattedGroup[] = [
    { name: 'S', bgColor: '#dc8add', txtColor: '#000000', list: [] },
    { name: 'A', bgColor: '#f66151', txtColor: '#000000', list: [] },
    { name: 'B', bgColor: '#ffbe6f', txtColor: '#000000', list: [] },
    { name: 'C', bgColor: '#f9f06b', txtColor: '#000000', list: [] },
    { name: 'D', bgColor: '#8ff0a4', txtColor: '#000000', list: [] },
    { name: 'E', bgColor: '#99c1f1', txtColor: '#000000', list: [] },
];

export const defaultOptions: Options = {
    titleTextColor: '',
    titleTextOpacity: 100,
    showAdvancedOptions: false,
    title: '',
    category: '',
    description: '',
    tags: [],
    itemWidth: 100,
    itemWidthAuto: true,
    itemHeightAuto: false,
    itemHeight: 100,
    itemPadding: 3,
    itemBorder: 1,
    itemMargin: 2,
    itemTextColor: '',
    itemTextOpacity: 100,
    itemTextPosition: 'bottom',
    itemTextBackgroundColor: '',
    itemTextBackgroundOpacity: 100,
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
    imageHeight: 600,
    nameWidth: 150,
    nameFontSize: 120,
    nameBackgroundOpacity: 100,
    nameMarkdown: false,
    imageBackgroundImage: 'none',
    imageBackgroundCustom: '',
    mode: 'default',
    direction: 'ltr',
};

export const imagesThemes = ['none', 'sakura', 'etoile', 'ciel', 'custom'];

export const themes: ThemeNames[] = ['default', 'compact', 'sakura', 'night', 'ciel'];

export const themesList: Theme[] = [
    {
        name: 'default',
        options: { ...defaultOptions },
    },
    {
        name: 'compact',
        options: {
            ...defaultOptions,
            itemTextPosition: 'bottom-over',
            itemWidth: 80,
            itemHeight: 100,
            itemPadding: 0,
            itemBorder: 0,
            itemMargin: 0,
            imageWidth: 1155,
            nameWidth: 100,
            nameFontSize: 100,
        },
    },
    {
        name: 'sakura',
        options: {
            ...defaultOptions,
            titleTextColor: '#000000',
            itemTextColor: '#000000',
            itemTextPosition: 'bottom',
            itemTextBackgroundColor: '',
            itemTextBackgroundOpacity: 100,
            itemBackgroundColor: '#f66151',
            itemBorderColor: '#ed333b',
            lineBackgroundColor: '#f39d9d',
            lineBorderColor: '#e97697',
            itemBackgroundOpacity: 40,
            itemBorderOpacity: 30,
            lineBackgroundOpacity: 60,
            lineBorderOpacity: 60,
            imageBackgroundColor: '#e1b6b6',
            nameBackgroundOpacity: 80,
            imageBackgroundImage: 'sakura',
        },
    },
    {
        name: 'night',
        options: {
            ...defaultOptions,
            titleTextColor: '#ffffff',
            itemTextColor: '#ffffff',
            itemTextPosition: 'bottom',
            itemTextBackgroundColor: '',
            itemTextBackgroundOpacity: 100,
            itemBackgroundColor: '#0a0e34',
            itemBorderColor: '#000000',
            lineBackgroundColor: '#0c124d',
            lineBorderColor: '#020118',
            itemBackgroundOpacity: 40,
            itemBorderOpacity: 30,
            lineBackgroundOpacity: 60,
            lineBorderOpacity: 60,
            imageBackgroundColor: '#010415',
            nameBackgroundOpacity: 90,
            imageBackgroundImage: 'etoile',
        },
    },
    {
        name: 'ciel',
        options: {
            ...defaultOptions,
            titleTextColor: '#0c124d',
            itemTextColor: '#0c124d',
            itemTextPosition: 'bottom',
            itemTextBackgroundColor: '',
            itemTextBackgroundOpacity: 100,
            itemBackgroundColor: '#1a5fb4',
            itemBorderColor: '#1c71d8',
            lineBackgroundColor: '#62a0ea',
            lineBorderColor: '#3584e4',
            itemBackgroundOpacity: 50,
            itemBorderOpacity: 50,
            lineBackgroundOpacity: 70,
            lineBorderOpacity: 70,
            imageBackgroundColor: '#99c1f1',
            nameBackgroundOpacity: 85,
            imageBackgroundImage: 'ciel',
        },
    },
];

export const defaultTheme = (name: ThemeNames) => themesList.find(e => e.name === name)!;

export const categories: string[] = [
    'animal',
    'anime',
    'board.game',
    'book',
    'brand',
    'comics',
    'computer',
    'ecology',
    'entertainment',
    'figure',
    'food',
    'game',
    'geography',
    'history',
    'language',
    'manga',
    'movie',
    'music',
    'people',
    'place',
    'politics',
    'programming',
    'roleplaying',
    'science',
    'series',
    'show',
    'sport',
    'technology',
    'vehicle',
    'video.game',
    'other',
];
