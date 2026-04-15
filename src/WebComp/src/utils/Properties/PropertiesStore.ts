import { Property, PropertyBuilder } from "./Property"
import { ProxyProperties, ProxyTarget } from "./PropertiesProxy";

export type Descriptors<T extends Record<string, any>> = {
    [K in keyof T]: PropertyBuilder<T, T[K]>
}

type Properties<T extends Record<string, any>> = {
    [K in keyof T]: Property<T[K]>
}

export class PropertiesStore<T extends Record<string, any>>
                                                implements ProxyTarget<T> {

    readonly properties = {} as Properties<T>;

    readonly mainProxy: ProxyProperties<T, PropertiesStore<T>>;

    constructor(descriptors: Descriptors<T>,
                proxy_cstr: new(target: ProxyTarget<T>) => T) {

        this.mainProxy = new proxy_cstr(this) as any; //TODO: better types...

        for(const propname in descriptors)
            this.properties[propname] = descriptors[propname](this.mainProxy);
    }

    get<K extends Extract<keyof T, string>>(name: K): T[K] {
        return this.properties[name].get();
    }

    set<K extends Extract<keyof T, string>>(name: K, value: T[K], source: unknown = null) {
            
        // no changes...
        if( ! this.properties[name].set(value) )
            return;

        // no needs to test it in get().
        if( __DEBUG__ ) this.validate(name);
        
        this.trigger(source);
    }

    validate(name: Extract<keyof T, string>) {
        if( this.properties[name].validate !== undefined ) {
            const result = this.properties[name].validate();
            if( result !== true ) {
                throw new Error(`Validation "${result.validation}" failed on property ${name}: got ${JSON.stringify(result.value)}.`);
            }
        }
    }

    protected readonly callbacks: ((src: unknown) => void)[] = [];
    addListener(callback: (src: unknown) => void) {
        this.callbacks.push(callback);
    }

    trigger(source: unknown) {

        for(let name in this.properties)
            this.properties[name].markStale();

        for(let i = 0; i < this.callbacks.length; ++i)
            this.callbacks[i](source);
    }
}