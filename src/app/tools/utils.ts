import { Classement, User } from '../interface';

const emailTest =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export class Utils {
    static objectChange(o1: any, o2: any): boolean {
        return (
            Object.keys(
                Object.keys(o2).reduce((diff, key) => {
                    return o1 && o2 && o1[key] === o2[key]
                        ? diff
                        : {
                              ...diff,
                              [key]: o2[key],
                          };
                }, {}),
            ).length > 0
        );
    }

    static downloadFile(content: string, fileName: string, contentType?: string) {
        var a = document.createElement('a');
        if (content.startsWith('data:')) {
            a.href = content;
        } else {
            var file = new Blob([content], contentType ? { type: contentType } : undefined);
            a.href = URL.createObjectURL(file);
        }
        a.download = fileName;
        a.click();
    }

    static jsonCopy<T>(o: T): T {
        return JSON.parse(JSON.stringify(o));
    }

    static getCookie<T extends string>(name: string): T | null {
        const cookies = document.cookie;
        const parts = cookies.match(`(?!; )?${name}=([^;]*);?`);
        return parts ? (parts[1] as T) : null;
    }

    static setCookie(name: string, value: string, days: number = 7, path: string = '/') {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value}; path=${path}; expires=${date.toUTCString()}`;
    }

    static removeCookie(name: string, path: string = '/') {
        document.cookie = `${name}=; path=${path}; Max-Age=0`;
    }

    static getParentElementByClass(element: HTMLElement, cssClass: string): HTMLElement | null {
        return Utils.containClasses(element, cssClass.trim().split(/\s+/))
            ? element
            : element.parentElement
            ? Utils.getParentElementByClass(element.parentElement, cssClass)
            : null;
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

    static testEmail(email: string): boolean {
        return email ? String(email).match(emailTest) !== null : false;
    }

    static async ulrToBase64(url: string): Promise<string | ArrayBuffer | null> {
        return new Promise<string | ArrayBuffer | null>(async (resolve, reject) => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'omit',
                    mode: 'cors', // Chromium
                    headers: {
                        'Sec-Fetch-Dest': 'image',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Site': 'same-site',
                    },
                });
                if (response.status === 200) {
                    const imageBlob = await response.blob();

                    var reader = new FileReader();
                    reader.readAsDataURL(imageBlob);
                    reader.onloadend = function () {
                        const base64data = reader.result;
                        if (base64data instanceof ArrayBuffer) {
                            resolve(base64data);
                        } else if (base64data) {
                            // fix typemine
                            resolve(
                                base64data.replace('data:application/octet-stream;base64,', 'data:image/webp;base64,'),
                            );
                        } else {
                            reject('Image error');
                        }
                        resolve(base64data);
                    };
                    reader.onerror = () => {
                        reject('Image error');
                    };
                } else {
                    reject('HTTP-Error: ' + response.status);
                }
            } catch (e) {
                reject('HTTP-Error: CORS');
            }
        });
    }

    static clipboard(text: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            navigator.clipboard.writeText(text).then(
                () => {
                    resolve();
                },
                () => {
                    reject();
                },
            );
        });
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

    static toISODate(date?: string | Date, newDate = false): string | undefined {
        if (typeof date === 'string' && date.trim()) {
            return date;
        }
        if (date instanceof Date) {
            return date.toISOString();
        }
        return newDate ? new Date().toISOString() : undefined;
    }
}
