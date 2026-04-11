// not used currently, ignore...
type Cstr = new(...args: any[]) => object;

type Method<
            CTX  extends {},
            ARGS extends any[]   = any[],
            RET  extends unknown = unknown
        > = (this: CTX, ...args: ARGS) => RET;

export type AsMethods<
                        CTX  extends {},
                        T extends Record<string, (...args: any[]) => unknown>
                    > = {
    [K in keyof T]: (this: CTX, ...args: Parameters<T[K]>) => ReturnType<T[K]>
}

export type Methods<CTX extends {}> = Record<string, Method<CTX>>;

//TODO: new type
export default function installMethods<
                    KLASS   extends Cstr,
                    METHODS extends Methods<InstanceType<KLASS>>
                >(
                    klass  : KLASS,
                    methods: METHODS
                ): asserts klass is KLASS
                    & (new(...args: any[]) => InstanceType<KLASS>
                                           & METHODS)
            {

    Object.assign(klass.prototype, methods);
}