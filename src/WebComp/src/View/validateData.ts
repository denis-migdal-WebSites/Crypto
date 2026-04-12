export type Data = Record<string, any>;
export type DataDesc<T extends Data> = {
    [K in keyof T]: {
        default   : T[K],
        validator?: NoInfer<(value: T[K]) => boolean>
    }
}

export const WC_ATTRNAME = "data-wc";

export default function validateData<
                DATA extends Data
            >(
            data    : NoInfer<Partial<DATA>>,
            dataDesc: DataDesc<DATA>,
        ) {

    const result = {} as DATA;

    for(let name in dataDesc) {
        // @ts-ignore
        result[name] = data[name] ?? dataDesc[name].default;

        if( __DEBUG__ ) {
            if( dataDesc[name].validator && ! dataDesc[name].validator(result[name]) )
                throw new Error(`Validation of ${name} failed: ${result[name]} does not match constraint ${dataDesc[name].validator.name}`);
        }
    }

    return result;
}