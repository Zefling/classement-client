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
}
