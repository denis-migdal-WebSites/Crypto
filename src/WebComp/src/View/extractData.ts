export type Data = Record<string, any>;
export type DataDesc<T extends Data> = {
    [K in keyof T]: (raw: string|null) => T[K]
}

const prefix = "data-wc-";

export function JSName2HTMLName(name: string) {

    const html_name = name.replaceAll(/[A-Z]/g, match => '-' + match.toLowerCase());

    return `${prefix}${html_name}`;
}

export function HTMLName2JSName(name: string) {

    const js_name = name.slice(prefix.length).replaceAll(/-[a-z]/g, match => '-' + match[1].toUpperCase());
    
    return js_name;
}

export default function extractData<
                DATA extends Data
            >(
            target      : HTMLElement,
            dataDesc    : DataDesc<DATA>,
            overrideVals: Partial<NoInfer<DATA>> = {}
        ) {

    const data = {} as DATA;

    for(let name in dataDesc) {

        if( overrideVals[name] !== undefined) {
            data[name] = overrideVals[name];
            continue;
        }

        const realname = `wc${name[0].toUpperCase() + name.slice(1)}`;

        data[name] = dataDesc[name](target.dataset[realname] ?? null);
    }

    return data;
}