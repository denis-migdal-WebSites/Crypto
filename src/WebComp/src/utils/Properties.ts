export type Data = Record<string, any>;
export type DataDesc<T extends Data> = {
    [K in keyof T]: {
        get      : (value: T[K]|undefined) => T[K],
        validate?: NoInfer<(value: T[K])   => boolean>
    }
}

// ================
const TARGET = Symbol();

type ProxyValues<T extends Record<string, any>> = T & {
    readonly [TARGET]: RootTarget<T>;
};

type RootTarget<T extends Record<string, any>> = {
    
    addListener(callback: (src: unknown) => void): void;
    updateProperties(values: Partial<T>): void;

    createWritableReference(): ProxyValues<T>
}

export function listenExternalChanges<T extends Record<string, any>>(
                            target: ProxyValues<T>,
                            callback: () => void
                        ) {

    const root = target[TARGET];

    root.addListener( (src) => {
        if( src === target)
            return;
        callback();
    });
}

export function updateProperties<T extends Record<string, any>>(
                                                target: ProxyValues<T>,
                                                values: NoInfer<Partial<T>>
                                            ) {

    const root = target[TARGET];
    root.updateProperties(values);
}

export function createWritableReference<T extends Record<string, any>>(
                                                target: ProxyValues<T>,
                                            ) {

    const root = target[TARGET];

    return root.createWritableReference();
}

// ================

// input : desc.
export default function createDataClass<T extends Data>(desc: DataDesc<T>) {
    
    //TODO: cf MWL Proxy
    // changed:
    // - use symbol
    // - src attrs
    // - helper fcts
    class PropertiesWritableValues {
        [TARGET]: Properties;
        constructor(target: Properties) {
            this[TARGET] = target;
        }
    }

    for(let name in desc) {
        Object.defineProperty(PropertiesWritableValues.prototype, name, {
            enumerable: true,
            get: function (this: PropertiesWritableValues) {
                return this[TARGET].values[name];
            },
            set: function(this: PropertiesWritableValues, value: any) {
                return this[TARGET].set(name, value, this);
            }
        })
    }
    // ==================================

    const defaults = {} as T;
    for(let k in desc)
        defaults[k] = desc[k].get(undefined);

    // TODO: moveout ?
    function validate<K extends keyof T>(name: T[K], value: NoInfer<T[K]>) {

        const validator = desc[name].validate
        if( validator === undefined )
            return;

        if( validator(value as any) )
            return;

        throw new Error(`Validation of property "${name}" failed: ${value} does not match constraint ${validator.name}`);
    }

    class Properties implements RootTarget<T> {

        readonly values: T = {...defaults};

        protected callbacks: ((src: unknown) => void)[] = [];
        addListener(callback: (src: unknown) => void) {
            this.callbacks.push(callback);
        }

        constructor(props: Partial<T>) {
            //TODO: lazy get + cache...
            this.updateProperties(props);
        }

        set<K extends keyof T>( name: K,
                                value: NoInfer<T[K]>,
                                source: unknown = null) {

            this.values[name] = value;

            if( __DEBUG__ )
                validate(name as any, value);

            this.trigger(source);
        }
        updateProperties(values: Partial<T>, source: unknown = null) {
            // @ts-ignore
            Object.assign(this.values, values);

            if( __DEBUG__ )
                for(let name in values)
                    validate(name as any, values[name]!);

            this.trigger(source);
        }

        protected trigger(source: unknown) {
            for(let i = 0; i < this.callbacks.length; ++i)
                this.callbacks[i](source);
        }

        createWritableReference() {
            //TODO: fix type...
            return new PropertiesWritableValues(this) as any as ProxyValues<T>;
        }
    }

    return (props: Partial<T> = {}) => {
        const data = new Properties(props);
        return data.createWritableReference();
    };
}