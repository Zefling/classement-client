import { Classement, FileString, FileType, FormattedGroup, Options, User } from '../interface/interface';

const isObject = (a: Record<string, any>, b: Record<string, any>) =>
    typeof a === 'object' && !Array.isArray(a) && !!a && !!b;

const changeTitleHeight = ['bottom', 'top'];

export class Utils {
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

    /**
     * Seeded pseudo-random number generator (mulberry32).
     * Returns a function that produces values in [0, 1).
     */
    static seededRng(seed: number): () => number {
        let s = seed >>> 0;
        return () => {
            s += 0x6d2b79f5;
            let t = Math.imul(s ^ (s >>> 15), 1 | s);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) >>> 0;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    /**
     * Shuffles a flat list of tiles using a seeded Fisher-Yates algorithm.
     * When `preserveCenter` is true and the total count forms an odd square
     * (3×3, 5×5, 7×7, …), the center tile index is kept in place.
     */
    static shuffleBingoTiles(tiles: FileType[], seed: number, preserveCenter = true): FileType[] {
        const count = tiles.length;
        const sqrtCount = Math.sqrt(count);
        const isOddSquare = preserveCenter && Number.isInteger(sqrtCount) && sqrtCount % 2 === 1 && sqrtCount >= 3;

        const centerIndex = isOddSquare ? Math.floor(count / 2) : -1;

        // Build an array of indices that are eligible for shuffling
        const indices = tiles.map((_, i) => i).filter(i => i !== centerIndex);

        const rng = Utils.seededRng(seed);

        // Fisher-Yates on the eligible indices
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        const result: FileType[] = new Array(count);
        if (centerIndex !== -1) {
            result[centerIndex] = tiles[centerIndex];
        }

        // Re-fill the non-center positions in original order with shuffled tiles
        const origNonCenter = tiles.filter((_, i) => i !== centerIndex);
        indices.forEach((pos, i) => {
            result[pos] = origNonCenter[i];
        });

        return result;
    }

    /**
     * Applies a bingo seed to groups: flattens all tiles, shuffles them,
     * then redistributes them back into the same group/row structure.
     */
    static applyBingoSeed(groups: FormattedGroup[], seed: number): FormattedGroup[] {
        if (!groups?.length) return groups;

        const rowLength = groups[0].list.length;
        const flat: FileType[] = groups.flatMap(g => g.list);

        const shuffled = Utils.shuffleBingoTiles(flat, seed, true);

        return groups.map((group, gi) => ({
            ...group,
            list: shuffled.slice(gi * rowLength, (gi + 1) * rowLength),
        }));
    }
}
