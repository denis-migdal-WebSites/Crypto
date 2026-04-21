#!/usr/bin/env -S deno --allow-read

export {};

declare const Deno: {
    readTextFile(path: string): Promise<string>;
};

// books extracted from https://www.gutenberg.org/.

let stats = new Map<string, number>();

for(let i = 1; i <= 1; ++i) {
    const book = await Deno.readTextFile(`./build/assets/book${i}.txt`);

    let count: number|undefined;
    let char : string;
    for(let j = 0; j < book.length; ++j) {
        char = book[j];
        count = stats.get(char);
        if( count === undefined ) count = 0;
        stats.set(char, count+1);
    }
}

stats.delete( String.fromCharCode(0xFEFF) );

console.log(JSON.stringify( [...stats.entries()] ));