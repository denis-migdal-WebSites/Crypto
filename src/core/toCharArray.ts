import CHARSET, { Char } from "./charset";

const DIACRITICS_REGEX = /\p{Diacritic}/gu;


function removeAccents(str: string) {
  return str.normalize('NFD').replace(DIACRITICS_REGEX, '');
}

// some characters are (voluntary) not supported.
export function formatRawString(str: string) {
    return removeAccents(str).toUpperCase();
}

// used to convert strings into ?
export default function toCharArray(str: string): readonly Char[] {
    
    const parts = new Array(str.length);
    str = formatRawString(str);

    for(let i = 0; i < str.length; ++i) {
        parts[i] = str[i];

        if( ! CHARSET.includes(str[i] as any))
            console.warn(str[i]);
    }
        //TODO: replace other chars by "." [?].

    return parts;
}

//TODO: move out ?
export function printable(str: string) {
    if( str === "\n")
        return "↵";

    return str;
}