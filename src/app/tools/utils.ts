import { Classement, FileString, FileType, FormattedGroup, Options, User } from '../interface/interface';

const isObject = (a: Record<string, any>, b: Record<string, any>) =>
    typeof a === 'object' && !Array.isArray(a) && !!a && !!b;

const changeTitleHeight = ['bottom', 'top'];

export class Utils {
    static objectsAreSame(objA?: Record<string, any>, objB?: Record<string, any>, ignoreKeys: string[] = []): boolean {
        if (objA === objB) {
            return true;
        } else if (objA === undefined || objB === undefined) {
            return false;
        }

        let areTheSame = true;

        const compareValues = (a: Record<string, any>, b: Record<string, any>) => {
            if (Array.isArray(a)) {
                if (Array.isArray(b)) {
                    const aCopy = [...a];
                    const bCopy = [...b];
                    if (a.length === b.length) {
                        aCopy.sort();
                        bCopy.sort();
                        aCopy.forEach((ele, idx) => compareValues(ele, bCopy[idx]));
                    } else {
                        areTheSame = false;
                    }
                } else {
                    areTheSame = false;
                }
            } else if (!isObject(a, b) && a !== b) {
                areTheSame = false;
            } else if (isObject(a, b) && !Utils.objectsAreSame(a, b, ignoreKeys)) {
                areTheSame = false;
            }
        };

        const keysA = Object.entries(objA)
            .filter(entry => !ignoreKeys.includes(entry[0]) && entry[1] !== undefined)
            .map(e => e[0]);
        const keysB = Object.entries(objB)
            .filter(entry => !ignoreKeys.includes(entry[0]) && entry[1] !== undefined)
            .map(e => e[0]);

        if (keysA.length !== keysB.length) {
            return false;
        }

        for (let key of keysA) {
            if (!ignoreKeys.includes(key)) {
                compareValues(objA[key], objB[key]);
                if (!areTheSame) {
                    return false;
                }
            }
        }

        return areTheSame;
    }

    static jsonCopy<T>(o: T): T {
        return JSON.parse(JSON.stringify(o));
    }

    static getCookie<T extends string>(name: string): T | undefined {
        const cookies = document.cookie;
        const parts = cookies.match(`(?!; )?${name}=([^;]*);?`);
        return parts ? (parts[1] as T) : undefined;
    }

    static setCookie(name: string, value: string, days: number = 7, path: string = '/') {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value}; path=${path}; expires=${date.toUTCString()}`;
    }

    static removeCookie(name: string, path: string = '/') {
        document.cookie = `${name}=; path=${path}; Max-Age=0`;
    }

    static getParentElementByClass(element: HTMLElement, cssClass: string): HTMLElement | undefined {
        return Utils.containClasses(element, cssClass.trim().split(/\s+/))
            ? element
            : element.parentElement
              ? Utils.getParentElementByClass(element.parentElement, cssClass)
              : undefined;
    }

    static containClasses(element: HTMLElement, cssClasses: string[]): boolean {
        if (!element.classList) {
            return false;
        }
        for (const cssClass of cssClasses) {
            if (!element.classList.contains(cssClass)) {
                return false;
            }
        }
        return true;
    }

    static removeClassement(classementsSource: Classement[] | undefined, classementsChange: Classement) {
        if (classementsSource && Array.isArray(classementsSource)) {
            const index = classementsSource.findIndex(e => e.rankingId === classementsChange.rankingId);
            if (index > -1) {
                classementsSource.splice(index, 1);
            }
        }
    }

    static updateClassements(
        classementsSource: Classement[] | undefined,
        classementsChange: Classement[],
        user?: User,
    ) {
        if (classementsSource && Array.isArray(classementsSource)) {
            for (const classement of classementsChange) {
                const index = classementsSource?.findIndex(e => e.rankingId === classement?.rankingId);
                if (index !== -1) {
                    classementsSource[index] = classement;
                } else if (!user || classement.user === user.username) {
                    classementsSource.push(classement);
                }
            }
        }
    }

    static normalizeString(string: string) {
        return string
            .toLocaleLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '');
    }

    static normalizeFileName(string: string) {
        return string
            .toLocaleLowerCase()
            .normalize('NFD')
            .replace(/[\p{Diacritic}\/|\\:*?"<>]/gu, '')
            .substring(0, 200);
    }

    static toISODate(date?: string | Date, newDate = false): string | undefined {
        if (typeof date === 'string' && date.trim()) {
            return date;
        }
        if (date instanceof Date) {
            return date.toISOString();
        }
        return newDate ? new Date().toISOString() : undefined;
    }

    static calcWidth(options: Options, item: FileString, tile: HTMLElement | null) {
        const title = tile?.querySelector('.title-span');

        if (!item.width) {
            const image = tile?.querySelector('img');
            item.width = image?.naturalWidth;
            item.height = image?.naturalHeight;
        }

        const itemHeight = options.itemHeight;
        const itemMaxWidth = options.itemMaxWidth;
        const itemWidthAuto = options.itemWidthAuto;

        const width = item.width || 100;
        const height = item.height || 100;

        const titleHeight = changeTitleHeight.includes(options.itemTextPosition) && title ? title.clientHeight + 3 : 0;

        if (tile) {
            if (options.mode === 'iceberg' || options.mode === 'axis') {
                if (options.itemWidthAuto || options.itemHeightAuto) {
                    if (width < height + titleHeight) {
                        tile.style.height = `${options.itemMaxHeight}px`;
                        tile.style.width = `${((options.itemMaxHeight - titleHeight) / height) * width}px`;
                    } else {
                        tile.style.height = options.itemWidthAuto
                            ? `${(itemMaxWidth / width) * height + titleHeight}px`
                            : 'auto';
                        tile.style.width = `${itemMaxWidth}px`;
                    }
                } else if (options.itemImageCover) {
                    tile.style.height = `${options.itemMaxHeight}px`;
                    tile.style.width = `${options.itemMaxWidth}px`;
                }
            } else {
                let targetHeight =
                    height < itemHeight - titleHeight ? height : Math.min(height, itemHeight) - titleHeight;

                tile.style.width =
                    itemWidthAuto && !item.title
                        ? Math.round(Math.min(itemMaxWidth ?? 300, (width / height) * targetHeight)) + 'px'
                        : itemWidthAuto
                          ? Math.round(
                                Math.min(
                                    itemMaxWidth ?? 300,
                                    Math.max(
                                        (width / height) * targetHeight,
                                        (title?.clientWidth ?? 0) + 1,
                                        (title?.scrollWidth ?? 0) + 1,
                                    ),
                                ),
                            ) + 'px'
                          : '';
            }
        }
    }

    static formattedTilesByMode(options: Options, groups: FormattedGroup[], list: FileType[]) {
        if (options.mode === 'teams') {
            groups.forEach(group => {
                group.list = group.list.map(tile => list.find(t => t?.id === tile?.id)!);
            });
        }
    }

    static listIsType(list: FileType[], group: string): boolean {
        return (list as any).type === group;
    }

    static getClassementId(classement: Classement) {
        return classement!.linkId || classement!.rankingId;
    }
}
