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
        document.cookie = `${name}=${value}`;
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
}
