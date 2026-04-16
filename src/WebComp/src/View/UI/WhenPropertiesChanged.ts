import { NO_VALUE } from "../../utils/NullObjects"
import { Elems } from "../resolveElements"
import { ViewCtx } from "../ViewContext"

function changed<K extends string>(propnames       : K[],
                                    properties     : Record<string, any>,
                                    previous_values: any[]
                                ) {

    for(let i = 0; i < propnames.length; ++i) {
        const value = properties[propnames[i]];
        if( value !== previous_values[i] ) {
            previous_values[i] = value;
            return true;
        }
    }

    return false;
}

export default function RefreshWhenPropertiesChanged<E extends Elems,
                                              C extends {properties: D},
                                              D extends Record<string, any>
                                              >(
                            propnames: Extract<keyof D, string>[],
                            callback : NoInfer<(ctx: ViewCtx<E>, ctrler: C) => void>
                        ) {
 
    const prev_values = new Array(propnames.length);
    prev_values.fill(NO_VALUE);

    return () => {
        return {
            refresh: (ctx: ViewCtx<E>, controller: C) => {

                if( ! changed(propnames, controller.properties, prev_values) )
                    return;
                
                callback(ctx, controller)
            }
        }
    }
}