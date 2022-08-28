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

    static jsonCopy<T>(o: T): T {
        return JSON.parse(JSON.stringify(o));
    }

    static getCookie<T extends string>(name: string): T | null {
        const cookies = document.cookie;
        const parts = cookies.match(`(?!; )?${name}=([^;]*);?`);
        return parts ? (parts[1] as T) : null;
    }

    static setCookie(name: string, value: string) {
        document.cookie = `${name}=${value}; path= /`;
    }

    static removeCookie(name: string) {
        document.cookie = `${name}=; path= /; Max-Age=0`;
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
}
