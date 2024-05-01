// Lida com os tipos bigInt que não suporta a serialização de objetos em formato JSON.

export function DefaultTypesJSON(obj: any): any {
    if (typeof obj === 'bigint') {
        return Number(obj);
    }
    if (Buffer.isBuffer(obj)){
        return Number(obj[0]);
    }
    else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                obj[key] = DefaultTypesJSON(obj[key]);
            }
        }
    }
    return obj;
}