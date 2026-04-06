type Cstr = new(...args:any[]) => any;

type Method<
            CTX  extends {},
            ARGS extends any[],
            RET  extends any
        > = (this: CTX, ...args: ARGS) => RET;

export type AsMethods<
                        CTX  extends {},
                        T extends Record<string, (...args: any) => any>
                    > = {
    [K in keyof T]: (this: CTX, ...args: Parameters<T[K]>) => ReturnType<T[K]>
}

export type Methods<CTX extends {}> = Record<string, Method<CTX, any, any>>;

//TODO: new type
export default function installMethods<
                    KLASS   extends Cstr,
                    METHODS extends Methods<InstanceType<KLASS>>
                >(
                    klass  : KLASS,
                    methods: METHODS
                ): asserts klass is KLASS
                    & (new(...args:any[]) => InstanceType<KLASS>
                                           & METHODS)
            {

    Object.assign(klass.prototype, methods);
}

/**/
class A {}
const B = A;
installMethods(B, {foo: (e: 34) => {}});

const a = new B();
a.foo(34);
/**/