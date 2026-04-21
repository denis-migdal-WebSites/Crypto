import CHARSET, { Char } from "./charset";

export function chiffrer(msg: readonly Char[], table: readonly Char[]) {
    const result = new Array(msg.length);

    for(let i = 0; i < msg.length; ++i)
        result[i] = table[CHARSET.indexOf(msg[i])];

    return result;
}

export function dechiffrer(msg: readonly Char[], table: readonly Char[]) {
    const result = new Array(msg.length);

    for(let i = 0; i < msg.length; ++i) {
        const idx = table.indexOf(msg[i]);
        result[i] = idx !== -1 ? CHARSET[idx]
                               : "";
    }

    return result;
}