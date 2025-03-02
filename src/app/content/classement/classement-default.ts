import { Select2Data } from 'ng-select2-component';

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
    title: '',
    category: '',
    description: '',
    tags: [],
    itemWidth: 100,
    itemWidthAuto: true,
    itemImageCover: false,
    itemMaxWidth: 300,
    itemHeight: 100,
    itemHeightAuto: false,
    itemMaxHeight: 300,
    itemPadding: 3,
    itemBorder: 1,
    itemMargin: 2,
    itemTextSize: 12,
    itemTextMinLine: 0,
    itemTextMaxLine: 10,
    itemTextOnlySize: 24,
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
    columnMinHeight: 250,
    axisLineWidth: 3,
    axisLineColor: '',
    axisLineOpacity: 100,
    axisArrowWidth: 15,
    nameWidth: 150,
    nameMinHeight: 90,
    nameFontSize: 120,
    nameBackgroundOpacity: 100,
    nameMarkdown: false,
    borderRadius: 4,
    borderSpacing: 1,
    borderSize: 1,
    groupLineColor: '',
    groupLineSize: 1,
    groupLineOpacity: 100,
    imageBackgroundImage: 'none',
    imageBackgroundCustom: '',
    mode: 'default',
    direction: 'ltr',
    font: '',
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
export const imagesBingo: ImagesNames[] = ['none', 'sakura', 'etoile', 'ciel', 'custom'];
export const imagesThemes = imagesLists;

export const themesLists: ThemesNames[] = ['default', 'compact', 'square', 'classic', 'sakura', 'night', 'ciel'];
export const themesIceberg: ThemesNames[] = ['iceberg', 'square'];
export const themesAxis: ThemesNames[] = ['axis', 'square'];
export const themesBingo: ThemesNames[] = ['bingo-s', 'bingo-m', 'bingo-l', 'grid'];
export const themes = themesLists;

export const themesList: Theme[] = [
    {
        id: 'default',
        source: 'default',
        name: 'default',
        options: { ...defaultOptions },
    },
    {
        id: 'default',
        source: 'default',
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
        id: 'default',
        source: 'default',
        name: 'square',
        options: {
            ...defaultOptions,
            itemTextPosition: 'bottom-over',
            itemWidth: 100,
            itemHeight: 100,
            itemHeightAuto: false,
            itemWidthAuto: false,
            itemImageCover: true,
            itemPadding: 0,
            itemBorder: 0,
            itemMargin: 0,
            imageWidth: 1010,
            nameWidth: 100,
            nameFontSize: 100,
        },
    },
    {
        id: 'default',
        source: 'default',
        name: 'sakura',
        options: {
            ...defaultOptions,
            titleTextColor: '#000000',
            itemTextColor: '#000000',
            itemTextPosition: 'bottom',
            itemTextBackgroundColor: '#f66151',
            itemTextBackgroundOpacity: 80,
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
        id: 'default',
        source: 'default',
        name: 'night',
        options: {
            ...defaultOptions,
            titleTextColor: '#ffffff',
            itemTextColor: '#ffffff',
            itemTextPosition: 'bottom',
            itemTextBackgroundColor: '#0a0e34',
            itemTextBackgroundOpacity: 80,
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
        id: 'default',
        source: 'default',
        name: 'ciel',
        options: {
            ...defaultOptions,
            titleTextColor: '#0c124d',
            itemTextColor: '#0c124d',
            itemTextPosition: 'bottom',
            itemTextBackgroundColor: '#99c1f1',
            itemTextBackgroundOpacity: 80,
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
        id: 'default',
        source: 'default',
        name: 'classic',
        options: {
            ...defaultOptions,
            itemHeight: 80,
            itemWidth: 80,
            lineBackgroundColor: '#1a1a17',
            lineBorderColor: '#000',
            borderRadius: 0,
            borderSize: 0,
            borderSpacing: 2,
            imageBackgroundColor: '#000',
            itemTextPosition: 'bottom-over',
            itemHeightAuto: false,
            itemWidthAuto: false,
            itemImageCover: true,
            itemPadding: 0,
            itemBorder: 0,
            itemMargin: 0,
            imageWidth: 900,
            nameWidth: 100,
            nameFontSize: 100,
            palette: [['#FF7F7F', '#FFFF7F'], '#7FFF7F'],
        },
    },
    {
        id: 'default',
        source: 'default',
        name: 'iceberg',
        options: {
            ...defaultOptions,
            mode: 'iceberg',
            imageBackgroundImage: 'iceberg',
            itemTextOnlySize: 12,
            itemBorder: 0,
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
        id: 'default',
        source: 'default',
        name: 'axis',
        options: {
            ...defaultOptions,
            mode: 'axis',
            itemTextOnlySize: 12,
            itemBorder: 0,
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
    {
        id: 'default',
        source: 'default',
        name: 'bingo-s',
        options: {
            ...defaultOptions,
            mode: 'bingo',
            itemPadding: 0,
            itemBorder: 0,
            itemMargin: 0,
            itemWidth: 100,
            itemHeight: 150,
            itemMaxWidth: 100,
            itemMaxHeight: 150,
            itemWidthAuto: false,
            itemHeightAuto: false,
            imageHeight: 1000,
            imageWidth: 1000,
            itemImageCover: true,
            imagePosition: 'center',
            itemTextPosition: 'bottom-bubble',
            sizeX: 5,
            sizeY: 5,
        },
    },
    {
        id: 'default',
        source: 'default',
        name: 'bingo-m',
        options: {
            ...defaultOptions,
            mode: 'bingo',
            itemPadding: 0,
            itemBorder: 0,
            itemMargin: 0,
            itemWidth: 120,
            itemHeight: 180,
            itemMaxWidth: 120,
            itemMaxHeight: 180,
            itemWidthAuto: false,
            itemHeightAuto: false,
            imageHeight: 1000,
            imageWidth: 1000,
            itemImageCover: true,
            imagePosition: 'center',
            itemTextPosition: 'bottom-bubble',
            sizeX: 5,
            sizeY: 5,
        },
    },
    {
        id: 'default',
        source: 'default',
        name: 'bingo-l',
        options: {
            ...defaultOptions,
            mode: 'bingo',
            itemPadding: 0,
            itemBorder: 0,
            itemMargin: 0,
            itemWidth: 160,
            itemHeight: 240,
            itemMaxWidth: 160,
            itemMaxHeight: 240,
            itemWidthAuto: false,
            itemHeightAuto: false,
            imageHeight: 1000,
            imageWidth: 1000,
            itemImageCover: true,
            imagePosition: 'center',
            itemTextPosition: 'bottom-bubble',
            sizeX: 5,
            sizeY: 5,
        },
    },
    {
        id: 'default',
        source: 'default',
        name: 'grid',
        options: {
            ...defaultOptions,
            mode: 'bingo',
            itemPadding: 0,
            itemBorder: 0,
            itemMargin: 0,
            itemWidth: 120,
            itemHeight: 180,
            itemMaxWidth: 120,
            itemMaxHeight: 180,
            itemWidthAuto: false,
            itemHeightAuto: false,
            imageHeight: 1000,
            imageWidth: 1000,
            itemImageCover: true,
            imagePosition: 'center',
            itemTextPosition: 'bottom-bubble',
            sizeX: 5,
            sizeY: 5,
            borderRadius: 0,
            borderSize: 10,
            borderSpacing: -1,
        },
    },
];

export const defaultTheme = (name: ThemesNames | undefined) => themesList.find(e => e.name === name) ?? themesList[0];

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
    'vtuber',
    'other',
];

export const listModes: Select2Data = [
    { value: 'default', label: 'default', data: { icon: 'tierlist' } },
    { value: 'teams', label: 'teams', data: { icon: 'teams' } },
    { value: 'columns', label: 'columns', data: { icon: 'columns' } },
    { value: 'iceberg', label: 'iceberg', data: { icon: 'iceberg' } },
    { value: 'axis', label: 'axis', data: { icon: 'axis' } },
    { value: 'bingo', label: 'bingo', data: { icon: 'bingo' } },
];

export const listFonts: Select2Data = [
    { value: 'Cinzel', label: 'Cinzel' },
    { value: 'Dela Gothic One', label: 'Dela Gothic One' },
    { value: 'Hachi Maru Pop', label: 'Hachi Maru Pop' },
    { value: 'Kalam', label: 'Kalam' },
    { value: 'Klee One', label: 'Klee One' },
    { value: 'Noto Sans', label: 'Noto Sans' },
    { value: 'Noto Sans JP', label: 'Noto Sans JP' },
    { value: 'Noto Sans KR', label: 'Noto Sans KR' },
    { value: 'Noto Serif', label: 'Noto Serif' },
    { value: 'Noto Serif JP', label: 'Noto Serif JP' },
    { value: 'Noto Serif KR', label: 'Noto Serif KR' },
    { value: '', label: 'Roboto', data: { note: 'font.default' } },
    { value: 'Sunflower', label: 'Sunflower' },
    { value: 'Train One', label: 'Train One' },
    { value: 'Zen Maru Gothic', label: 'Zen Maru Gothic' },
];

export const textPosition: Select2Data = [
    { value: 'bottom', label: 'bottom' },
    { value: 'bottom-over', label: 'bottom.float' },
    { value: 'bottom-over-hover', label: 'bottom.float.hover' },
    { value: 'bottom-bubble', label: 'bottom.bubble' },
    { value: 'top', label: 'top' },
    { value: 'top-over', label: 'top.float' },
    { value: 'top-over-hover', label: 'top.float.hover' },
    { value: 'top-bubble', label: 'top.bubble' },
    { value: 'hidden', label: 'hidden' },
];

export const direction: Select2Data = [
    { value: 'rtl', label: 'rtl' },
    { value: 'ltr', label: 'ltr' },
];

export const align: Select2Data = [
    { value: 'start', label: 'start' },
    { value: 'center', label: 'center' },
    { value: 'end', label: 'end' },
];
