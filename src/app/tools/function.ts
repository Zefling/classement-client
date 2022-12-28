import { Coloration } from 'coloration-lib';

export const color = (c: string, opacity: number): string | null => {
    return c ? new Coloration(c).addColor({ alpha: (-1 * (100 - opacity)) / 100 }).toHEX() : null;
};
