import { FormattedGroup, ImagesNames, Options, Theme, ThemesNames } from 'src/app/interface/interface';

export const defaultGroup: FormattedGroup[] = [
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
    itemMaxWidth: 300,
    itemHeight: 100,
    itemHeightAuto: false,
    itemMaxHeight: 300,
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
    axisLineWidth: 3,
    axisLineColor: '',
    axisLineOpacity: 100,
    axisArrowWidth: 15,
    nameWidth: 150,
    nameFontSize: 120,
    nameBackgroundOpacity: 100,
    nameMarkdown: false,
    groupLineColor: '',
    groupLineSize: 1,
    groupLineOpacity: 100,
    imageBackgroundImage: 'none',
    imageBackgroundCustom: '',
    mode: 'default',
    direction: 'ltr',
};

export const imageInfos: Partial<Record<ImagesNames, { normal: string; mini: string }>> = {
    iceberg: {
        normal: 'iceberg.jpg',
        mini: 'iceberg.mini.webp',
    },
    sakura: {
        normal: 'sakura.svg',
        mini: 'sakura.mini.svg',
    },
    etoile: {
        normal: 'etoile.svg',
        mini: 'etoile.mini.svg',
    },
    ciel: {
        normal: 'ciel.svg',
        mini: 'ciel.mini.svg',
    },
};

export const imagesLists: ImagesNames[] = ['none', 'sakura', 'etoile', 'ciel', 'custom'];
export const imagesIceberg: ImagesNames[] = ['none', 'iceberg', 'custom'];
export const imagesAxis: ImagesNames[] = ['none', 'custom'];
export const imagesThemes = imagesLists;

export const themesLists: ThemesNames[] = ['default', 'compact', 'sakura', 'night', 'ciel'];
export const themesIceberg: ThemesNames[] = ['iceberg'];
export const themesAxis: ThemesNames[] = ['axis'];
export const themes = themesLists;

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
    {
        name: 'iceberg',
        options: {
            ...defaultOptions,
            mode: 'iceberg',
            imageBackgroundImage: 'iceberg',
            itemMaxWidth: 150,
            itemMaxHeight: 150,
            itemHeightAuto: true,
            groupLineSize: 3,
            groupLineColor: '#e01b24',
            groupLineOpacity: 80,
            imageHeight: 1500,
            imageWidth: 1000,
            imageSize: 'cover',
            imagePosition: 'center',
            groups: [
                { title: '0' },
                { title: '1' },
                { title: '2' },
                { title: '3' },
                { title: '4' },
                { title: '5' },
                { title: '6' },
                { title: '7' },
            ],
        },
    },
    {
        name: 'axis',
        options: {
            ...defaultOptions,
            mode: 'axis',
            itemMaxWidth: 150,
            itemMaxHeight: 150,
            itemHeightAuto: true,
            imageHeight: 1000,
            imageWidth: 1000,
            imageSize: 'cover',
            imagePosition: 'center',
            groups: [
                { title: 'Y' },
                { title: ' ' },
                { title: 'X' },
                { title: '' },
                { title: '' },
                { title: '' },
                { title: '' },
                { title: '' },
            ],
        },
    },
];

export const defaultTheme = (name: ThemesNames) => themesList.find(e => e.name === name)!;

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
