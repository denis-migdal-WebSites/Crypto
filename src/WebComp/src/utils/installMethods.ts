import { Cstr } from "./createInstance";

// not used currently, ignore...
type Method<
            CTX  extends {},
            ARGS extends unknown[]   = never[],
            RET  = unknown
        > = (this: CTX, ...args: ARGS) => RET;

export type AsMethods<
                        CTX  extends {},
                        T extends Record<string, (...args: never[]) => unknown>
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
                    & (new(...args: unknown[]) => InstanceType<KLASS>
                                           & METHODS)
            {

    Object.assign(klass.prototype, methods);
}