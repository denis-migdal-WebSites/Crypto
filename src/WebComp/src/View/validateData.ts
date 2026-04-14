import { Data, DataDesc } from "../utils/Properties";

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
            if( dataDesc[name].validate && ! dataDesc[name].validate(result[name]) )
                throw new Error(`Validation of ${name} failed: ${result[name]} does not match constraint ${dataDesc[name].validate.name}`);
        }
    }

    if( __DEBUG__ ) {

        for(let name in data)
            if( ! (name in dataDesc) )
                throw new Error(`Unknown data ${name}`);
    }

    return result;
}