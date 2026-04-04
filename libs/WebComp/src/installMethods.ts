type Cstr = new(...args:any[]) => any;

type Method<
            CTX  extends {},
            ARGS extends any[],
            RET  extends any
        > = (this: CTX, ...args: ARGS) => RET;

export type Methods<CTX extends {}> = Record<string, Method<CTX, any, any>>;

//TODO: new type
export default function installMethods<
                    KLASS   extends Cstr,
                    ACTIONS extends Methods<InstanceType<KLASS>>
                >(klass: KLASS, methods: ACTIONS) {

    Object.assign(klass.prototype, methods);
}