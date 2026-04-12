export type Data = Record<string, any>;
export type DataDesc<T extends Data> = {
    [K in keyof T]: (raw: string|null) => T[K]
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