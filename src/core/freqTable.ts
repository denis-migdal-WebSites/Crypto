import char_freq from "./char_freq";
import CHARSET, { Char } from "./charset";
import { formatRawString } from "./toCharArray";

export type FreqTable = readonly [Char, number][];

export function countChars(input: readonly string[]) {

    const map = new Map<string, number>();

    for(let i = 0; i < input.length; ++i) {
        const char = input[i];

        const nb = map.get(char) ?? 0;
        map.set(char, nb+1);
    }

    return [...map.entries()];
}

export default function freqTable(entries: readonly [string, number][] = char_freq): FreqTable {

    const map = new Map<Char, number>();

    let sum = 0;

    for(let i = 0; i < entries.length; ++i) {
        let [char, count] = entries[i];

        const fchar = formatRawString( char.toUpperCase() ) as Char;

        if( ! CHARSET.includes(fchar) )
            continue;

        sum += count;

        const nb = map.get(fchar) ?? 0;
        map.set(fchar, count + nb);
    }

    const top = [...map.entries()];

    for(let i = 0; i < top.length; ++i)
        top[i][1] /= sum;

    top.sort( (a, b) => b[1]-a[1] );

    return top;
}