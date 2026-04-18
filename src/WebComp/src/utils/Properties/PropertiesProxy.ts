import { FCT_FALSE, NULL_OP } from "../NullObjects";
import { PropertiesStore } from "./PropertiesStore";

export type ProxyTarget<T extends Record<string, any>> = {
    
    get: <K extends Extract<keyof T, string>>(name: K) => T[K];
    set: <K extends Extract<keyof T, string>>(name: K, value: T[K], source?: unknown) => void;
}

export const PROXY_TARGET = Symbol();
export const PROXY_CLONE  = Symbol();

export type ProxyProperties<T extends Record<string, any> = Record<string, any>, U = object> = {
    readonly [PROXY_TARGET]: U
    readonly [PROXY_CLONE ]: () => ProxyProperties<T, U>
} & T;

export function clonePropertiesProxy<T extends ProxyProperties>(proxy: T) {
    return proxy[PROXY_CLONE]() as T;
}

type GetProperties<T> = T extends ProxyProperties<infer D, any> ? D : never;

export function updateProperties<
                            T extends ProxyProperties,
                        >(proxy: T, values: NoInfer<Partial<GetProperties<T>>>) {
    const target = proxy[PROXY_TARGET];

    // @ts-ignore
    target.updateProperties( values );
}

//For testing purpose... (+signals)
//TODO: overrideUiProperties
//TODO: rewriteProperties
    // (p) => fixed().
    // (p) => temporary(p).
export function overrideProperties<
                            T extends ProxyProperties,
                        >(proxy: T, values: NoInfer<Partial<GetProperties<T>>>) {

    const target = proxy[PROXY_TARGET] as PropertiesStore<GetProperties<T>>;

    for(const key in values) {

        const value = values[key]!;
        //const property = target.properties[key];

        target.properties[key] = {
            get() { return value; },
            set      : FCT_FALSE,
            markStale: NULL_OP,
        }
    }
}

//TODO: cf MWL Proxy
// changed:
// - use symbol
// - src attrs
// - helper fcts
// TODO: better return type...
export default function createProxyClass<T extends Record<string, any>>(
                                    keys: readonly (Extract<keyof T, string>)[]
                                ) {

    class ProxyProperties {
        readonly [PROXY_TARGET]: ProxyTarget<T>;

        constructor(target: ProxyTarget<T>) {
            this[PROXY_TARGET] = target;
        }

        [PROXY_CLONE]() {
            return new ProxyProperties( this[PROXY_TARGET] );
        }
    }

    for(let i = 0; i < keys.length; ++i ) {
        const name = keys[i];
        Object.defineProperty(ProxyProperties.prototype, name, {
            enumerable: true,
            get: function (this: ProxyProperties) {
                return this[PROXY_TARGET].get(name);
            },
            set: function(this: ProxyProperties, value: any) {
                return this[PROXY_TARGET].set(name, value, this);
            }
        })
    }

    return ProxyProperties;
}