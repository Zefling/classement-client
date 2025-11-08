import Color from 'colorjs.io';

import { Palette } from '../interface/interface';

export const color = (c: string, opacity: number | undefined): string | null => {
    if (c) {
        const color = new Color(c);
        if (opacity !== undefined) {
            color.alpha = opacity / 100;
        }
        return color.toString({ format: 'hex' });
    }
    return null;
};

export const palette = (palette: Palette, item: number): string[] => {
    const frag = { expand: 0, unique: 0 };
    palette.forEach(e => {
        if (Array.isArray(e)) {
            frag.expand++;
        } else {
            frag.unique++;
        }
    });
    const expandSize = frag.expand ? (item - frag.unique) / frag.expand : 0;
    const list: string[] = [];
    palette.forEach(e => {
        if (Array.isArray(e)) {
            const color = new Color(e[0]);
            for (let i = 0; i < expandSize; i++) {
                list.push(toHEX(color.mix(e[1], i / (expandSize - 1))));
            }
        } else {
            list.push(e);
        }
    });

    return list;
};

export const mixColor = (color1: string, color2: string) => {
    return toHEX(new Color(color1).mix(color2, 0.5));
};

export const toHEX = (c: Color): string => {
    return c.toGamut({ space: 'srgb' }).to('srgb').toString({ format: 'hex' });
};

export function randomizeArray<T>(c: T[]): T[] {
    return c
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

export function minMax(value: any, min: number, max: number, _multipleOf: number) {
    return Math.min(max, Math.max(min, value));
}

export function boolean(value: any) {
    return value === true || value === 'true';
}

export function inList(value: any, list: any[]) {
    return list.includes(value) ? value : list[0];
}
