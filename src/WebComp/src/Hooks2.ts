type Hook  = (...args: any[]) => any;
type Hooks = Record<string, Hook>;

type ReturnOf_void <T> = T extends (...args: any[]) => infer R ? R : void;
type ReturnOf_never<T> = T extends (...args: any[]) => infer R ? R : never;

type HookCaller<T extends Hooks> = <K extends keyof T>(
                                            name: K,
                                            ...args: Parameters<T[K]>
                                        ) => ReturnOf_void<T[K]>

type WithHooks<T extends Hooks> = {callHook: HookCaller<T>}

type HookProvider<T extends WithHooks<any>>
    = (target: T) => T["callHook"];

// hooks()
/**
// TODO: use in View
type HandlersProvider<T extends WithHooks<any>>
    = T extends WithHooks<infer U>
        ? {[K in keyof U as `on${Capitalize<K & string>}`]: 
            (
                this   : void,
                source : T,
                ...args: Parameters<U[K]>
            ) => ReturnOf_never<U[K]>
        }
        : never;/**/
/**/
type HandlersProvider<T extends WithHooks<any>>
    = T extends WithHooks<infer U>
        ? {[K in keyof U]: (
                this   : void,
                source : T,
                ...args: Parameters<U[K]>
            ) => ReturnOf_never<U[K]>}
        : never;
/**/
function hooks<T extends WithHooks<any>>(
                            handlersProvider: HandlersProvider<NoInfer<T>>
                        ): HookProvider<T> {

    return (target) => ((name: string, ...args: any[]) => {

        if( ! (name in handlersProvider) )
            return;

        // @ts-ignore
        return handlersProvider[name](target, ...args as any)
    }) as any;
}

// ==================================================================
// ==================== TESTS =======================================
// ==================================================================

/**/

type AH = {
    "foo": (i: number) => void
};

class A {

    readonly callHook: HookCaller<AH>;

    // NO_HOOKS quite hard to create (?).
    constructor(hooksProvider: HookProvider<A>) {
        this.callHook = hooksProvider(this);

        const rest = this.callHook("foo", 24);
        void rest; // test
    }
}

new A( hooks({
    foo() {
        return 34;
    }
}));

type BH = {
    "foo": (i: number) => void,
    "faa"?: (i: string) => void
};

class B extends A {

    declare readonly callHook: HookCaller<BH>;

    // NO_HOOKS quite hard to create (?).
    constructor(hooksProvider: HookProvider<B>) {
        super(hooksProvider);

        const rest = this.callHook("foo", 24);
        void rest; // test
    }
}

new B( hooks({
    foo(_e, _f) {
        return 34;
    },
    //faa: undefined
}));

/**/