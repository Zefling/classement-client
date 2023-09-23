import { Injectable, Renderer2, RendererFactory2, RendererStyleFlags2 } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { Subject } from 'rxjs';

import { Logger, LoggerLevel } from './logger';

import { defaultOptions } from '../content/classement/classement-default';
import {
    Data,
    FileHandle,
    FileStream,
    FileString,
    FormattedGroup,
    Options,
    PreferenceInterfaceTheme,
    ThemeOptions,
} from '../interface/interface';
import { color } from '../tools/function';
import { Utils } from '../tools/utils';

export enum TypeFile {
    image = 'image',
    json = 'json',
    text = 'text',
}

export const typesMine: Record<string, string[]> = {
    image: ['image/png', 'image/gif', 'image/jpeg', 'image/webp'],
    json: ['application/json'],
};

@Injectable({ providedIn: 'root' })
export class GlobalService {
    readonly onForceExit = new Subject<string | undefined>();

    readonly onFileLoaded = new Subject<FileStream>();

    readonly onPageUpdate = new Subject<number>();

    readonly onLocalSave = new Subject<void>();

    readonly onUpdateList = new Subject<void>();

    readonly onImageUpdate = new Subject<void>();

    withChange = false;

    lang!: string;

    licenses!: string;

    jsonTmp?: Data;

    browserShema: PreferenceInterfaceTheme;
    userShema?: PreferenceInterfaceTheme;

    private renderer: Renderer2;

    constructor(
        readonly rendererFactory: RendererFactory2,
        private readonly logger: Logger,
        private readonly title: Title,
        private readonly translate: TranslateService,
    ) {
        // fix `NullInjectorError: No provider for Renderer2!`
        this.renderer = rendererFactory.createRenderer(null, null);

        this.browserShema = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        this.changeThemeClass();

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            this.browserShema = event.matches ? 'dark' : 'light';
            this.changeThemeClass();
        });
    }

    setTitle(key: string, admin = false) {
        this.title.setTitle(
            `${this.translate.instant(key)}${
                admin ? `- ${this.translate.instant('menu.admin')}` : ''
            } - ${this.translate.instant('classement')}`,
        );
    }

    forceExit(route: string | undefined) {
        this.onForceExit.next(route);
    }

    classementSave() {
        this.onLocalSave.next();
    }

    updateList() {
        this.onUpdateList.next();
    }

    addTexts(text: string) {
        const lines = text.split('\n');
        for (const line of lines) {
            const trimString = line.trim();
            this.onFileLoaded.next({
                filter: TypeFile.text,
                file: {
                    name: '',
                    url: '',
                    size: trimString.length,
                    realSize: trimString.length,
                    type: 'plain/text',
                    date: new Date().getTime(),
                    title: trimString,
                    width: 150,
                },
            });
        }
    }

    addFiles(files: FileList, filter: TypeFile) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (typesMine[filter].includes(file.type)) {
                const data: FileHandle = {
                    file,
                };

                let reader = new FileReader();
                reader.onload = (ev: ProgressEvent<FileReader>) => {
                    data.target = ev.target;
                };
                reader.onloadend = (_ev: ProgressEvent<FileReader>) => {
                    this._format(data, filter);
                };
                reader.readAsDataURL(data.file);
            }
        }
    }

    fixImageSize(groups: FormattedGroup[], list: FileString[]) {
        list.forEach(item => {
            this._fixImage(item);
        });
        groups.forEach(group =>
            group.list.forEach(item => {
                this._fixImage(item);
            }),
        );
    }

    /**
     * fix for html2canavas (not work with https? images)
     * @param groups groups
     * @param list list
     * @returns cache image in base64 `[url : base64]`
     */
    async imagesCache(
        options: ThemeOptions,
        groups: FormattedGroup[],
        list: FileString[] = [],
    ): Promise<Record<string, string | ArrayBuffer | null>> {
        const cache: Record<string, string | ArrayBuffer | null> = {};
        for (const item of list) {
            if (item.url) {
                cache[item.url] = await Utils.ulrToBase64(item.url);
            }
        }
        for (const group of groups) {
            for (const item of group.list) {
                if (item.url) {
                    cache[item.url] = await Utils.ulrToBase64(item.url);
                }
            }
        }
        if (options.imageBackgroundCustom) {
            cache[options.imageBackgroundCustom] = await Utils.ulrToBase64(options.imageBackgroundCustom);
        }
        return cache;
    }

    updateVarCss(o: Options, cache: Record<string, string | ArrayBuffer | null>): void {
        const body = document.body;
        const r = this.renderer.setStyle;
        const dash = RendererStyleFlags2.DashCase;
        // title
        r(body, '--over-title-text-color', color(o.titleTextColor, o.titleTextOpacity), dash);
        // item
        const itemWidth = o.itemWidthAuto ? 'auto' : (o.itemWidth ?? defaultOptions.itemWidth) + 'px';
        r(body, '--over-item-width', itemWidth, dash);

        const itemHeight = o.itemHeightAuto ? 'auto' : (o.itemHeight ?? defaultOptions.itemHeight) + 'px';
        r(body, '--over-item-height', itemHeight, dash);
        r(body, '--over-item-padding', (o.itemPadding ?? defaultOptions.itemPadding) + 'px', dash);
        r(body, '--over-item-border', (o.itemBorder ?? defaultOptions.itemBorder) + 'px', dash);
        r(body, '--over-item-margin', (o.itemMargin ?? defaultOptions.itemMargin) + 'px', dash);
        r(body, '--over-item-background', color(o.itemBackgroundColor, o.itemBackgroundOpacity), dash);
        r(body, '--over-item-border-color', color(o.itemBorderColor, o.itemBorderOpacity), dash);
        r(body, '--over-item-text-color', color(o.itemTextColor, o.itemTextOpacity), dash);
        r(body, '--over-item-text-background', color(o.itemTextBackgroundColor, o.itemTextBackgroundOpacity), dash);
        // drop zone group
        r(body, '--over-drop-list-background', color(o.lineBackgroundColor, o.lineBackgroundOpacity), dash);
        r(body, '--over-drop-list-border-color', color(o.lineBorderColor, o.lineBorderOpacity), dash);
        // name group
        r(body, '--over-name-width', (o.nameWidth ?? defaultOptions.nameWidth) + 'px', dash);
        r(body, '--over-name-font-size', (o.nameFontSize ?? defaultOptions.nameFontSize) + '%', dash);
        // image background
        r(body, '--over-image-background', o.imageBackgroundColor, dash);
        r(body, '--over-image-width', (o.imageWidth ?? defaultOptions.imageWidth) + 'px', dash);
        if (o.mode === 'axis' || o.mode === 'iceberg') {
            r(body, '--over-image-height', (o.imageHeight ?? defaultOptions.imageHeight) + 'px', dash);
        }
        r(
            body,
            '--over-image-url',
            o.imageBackgroundImage !== 'none'
                ? o.imageBackgroundImage === 'custom'
                    ? `url(${cache[o.imageBackgroundCustom] || o.imageBackgroundCustom})`
                    : `url(./assets/themes/${o.imageBackgroundImage}.svg)`
                : null,
            dash,
        );
    }

    getValuesFromOptions(o: Options) {
        return {
            nameOpacity:
                Math.round(o.nameBackgroundOpacity * 2.55)
                    ?.toString(16)
                    .padStart(2, '0') ?? 'FF',
        };
    }

    private _fixImage(item: FileString) {
        if (item.type?.startsWith('image') && !item.width) {
            this.imageDimensions(item.url!)
                .then(size => {
                    item.width = size.width;
                    item.height = size.height;
                })
                .catch(e => this.logger.log('Error file:', LoggerLevel.error, item.name, e));
        }
    }

    private _format(file: FileHandle, filter: TypeFile) {
        const url = file.target?.result ? String(file.target?.result) : undefined;
        if (url) {
            this.logger.log('Add file:', LoggerLevel.log, file.file.name);
            if (filter === TypeFile.image) {
                this.imageDimensions(file.file)
                    .then(size => {
                        this.onFileLoaded.next({
                            filter,
                            file: {
                                name: file.file.name,
                                url: url,
                                size: url.length,
                                realSize: file.file.size,
                                type: file.file.type,
                                date: file.file.lastModified,
                                title: '',
                                width: size.width,
                                height: size.height,
                            },
                        });
                    })
                    .catch(e => this.logger.log('Error file:', LoggerLevel.error, file.file.name, e));
            } else {
                this.onFileLoaded.next({
                    filter,
                    file: {
                        name: file.file.name,
                        url: url,
                        size: url.length,
                        realSize: file.file.size,
                        type: file.file.type,
                        date: file.file.lastModified,
                    },
                });
            }
        } else {
            this.logger.log('Error file:', LoggerLevel.error, file.file.name);
        }
    }

    imageDimensions(file: File | string): Promise<{ width: number; height: number }> {
        return new Promise<{ width: number; height: number }>((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                const { naturalWidth: width, naturalHeight: height } = img;
                resolve({ width, height });
            };

            img.onerror = () => {
                reject('There was some problem with the image.');
            };

            img.src = typeof file === 'string' ? file : URL.createObjectURL(file);
        });
    }

    toggleTheme() {
        this.userShema = this.currentTheme() === 'light' ? 'dark' : 'light';
    }

    currentTheme(): PreferenceInterfaceTheme {
        return this.userShema ?? this.browserShema ?? 'light';
    }

    changeThemeClass() {
        this.logger.log('color theme:', LoggerLevel.log, this.userShema);
        this.renderer.addClass(document.body, this.currentTheme() === 'light' ? 'light-mode' : 'dark-mode');
        this.renderer.removeClass(document.body, this.currentTheme() !== 'light' ? 'light-mode' : 'dark-mode');
    }
}
