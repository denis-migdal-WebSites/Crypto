import { PropertiesStore } from "./PropertiesStore";
import { PROXY_TARGET, ProxyProperties } from "./PropertiesProxy";
import { NO_VALUE } from "../NullObjects";

export function onPropertiesChange<T extends Record<string, any>>(
                            target  : ProxyProperties<T, PropertiesStore<T>>,
                            callback: (src: unknown) => void
                        ) {

    const store = target[PROXY_TARGET];

    store.addListener( callback );
}

export function onPropertiesExternalChange<T extends Record<string, any>>(
                            target  : ProxyProperties<T, PropertiesStore<T>>,
                            callback: () => void
                        ) {

    onPropertiesChange( target, (src) => {
        if( src !== target ) callback();
    })
}


export function propertiesChangeDetector<T extends Record<string, any>>(
                                        target: T,
                                        ...keys: Extract<keyof T, string>[]
                                    ) {

    const prev_values = new Array(keys.length);
    prev_values.fill(NO_VALUE);

    return () => {
        for(let i = 0; i < keys.length; ++i) {
                const value = target[keys[i]];
                if( value !== prev_values[i] ) {
                    prev_values[i] = value;
                    return true;
                }
            }

            return false;
    }
}