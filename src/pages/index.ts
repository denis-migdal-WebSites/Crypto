import { resolveElements } from "@WebCompLib"

import MappedInputGrid from "../components/MappedInputGrid";

import "../WebComp/src/utils/Properties/test";

/***/

import char_freq from "../char_freq";
function calc_freq(entries: [string, number][]) {

    const map = new Map<string, number>();

    let sum = 0;

    for(let i = 0; i < entries.length; ++i) {
        let [char, count] = entries[i];
        char = char.toUpperCase();

        if( ["\r", "º"].includes(char) )
            continue;

        if( char === "\n" )
            char = "↵";

        sum += count;

        const nb = map.get(char) ?? 0;
        map.set(char, count + nb);
    }

    const top = [...map.entries()];

    for(let i = 0; i < top.length; ++i)
        top[i][1] /= sum;

    top.sort( (a, b) => b[1]-a[1] );

    return top;
}

const top = calc_freq(char_freq);

console.warn(top);

const labels   = top.map( ([char, _count]) => char);
const expected = top.map( ([_char, count]) => `${(count*100).toFixed(2)}%`);

/***/


const elems = resolveElements(document.body, {
    "inputgrid": new MappedInputGrid({
                    labels,
                    expected,
                    ro      : true
                }),
    "test": () => new MappedInputGrid({
        labels  : ["H", "e", "l", "l", "o"],
        expected: ["H", "e", "l", "l", "o"],
        ro: false,
    })
});

elems.inputgrid.style.setProperty("width", "500px");
