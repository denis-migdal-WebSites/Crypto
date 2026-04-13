import { resolveElements } from "@WebCompLib"

import MappedInputGrid from "../components/MappedInputGrid";"../components/MappedInputGrid";

const elems = resolveElements(document.body, {
    "inputgrid": new MappedInputGrid({
                    labels  : ["H", "e", "l", "l", "o", "o"],
                    expected: ["H", "e", "l", "l", "o", "o"],
                    //ro      : true
                })
});

elems.inputgrid.style.setProperty("width", "100px");

import char_freq from "../char_freq";
function calc_freq(entries: [string, number][]) {

    const map = new Map<string, number>();

    let sum = 0;

    for(let i = 0; i < entries.length; ++i) {
        let [char, count] = entries[i];
        char = char.toUpperCase();
        // we can filter here

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

console.warn( calc_freq(char_freq) );