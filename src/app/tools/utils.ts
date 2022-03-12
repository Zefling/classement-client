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

    static jsonCopy(o: any) {
        return JSON.parse(JSON.stringify(o));
    }
}
