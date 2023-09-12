export const queryStringToObject = (url: string): Record<string, string> => {
    return [...new URLSearchParams(url.split('?')[1])].reduce(
        (a, [k, v]) => ((a[k] = v), a),
        {}
    );
}