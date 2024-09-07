import { Coloration } from 'coloration-lib';
import { Palette } from '../interface/interface';

export const color = (c: string, opacity: number): string | null => {
    return c ? new Coloration(c).addColor({ alpha: (-1 * (100 - opacity)) / 100 }).toHEX() : null;
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
            const color = new Coloration(e[0]);
            for (let i = 0; i < expandSize; i++) {
                list.push(color.maskColor(e[1], i / (expandSize - 1)).toHEX());
            }
        } else {
            list.push(e);
        }
    });

    return list;
};
