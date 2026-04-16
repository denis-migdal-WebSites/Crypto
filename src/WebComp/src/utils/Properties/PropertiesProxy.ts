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

/*
    // better: force value (for tests).
export function createPropertiesStub<
                            T extends ProxyProperties,
                        >(proxy: T, values: NoInfer<Partial<GetProperties<T>>>) {

    const result = {} as T;
    for(const key in proxy)
        result[key] = proxy[key];

    for(const key in values)
        // @ts-ignore
        result[key] = values[key];

    return result;
}*/

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