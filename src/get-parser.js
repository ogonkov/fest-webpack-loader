export function getParser() {
    return import('xml2js').then(function({parseStringPromise}) {
        return parseStringPromise;
    });
}
