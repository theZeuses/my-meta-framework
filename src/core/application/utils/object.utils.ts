export const isEmptyObject = (object: Record<any, any>) => {
    return Object.keys(object).length == 0;
}