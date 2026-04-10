type Hook  = (...args: any[]) => any;
export type Hooks = Record<string, Hook>;

export type ReturnOf_void <T> = T extends (...args: any[]) => infer R ? R : void;
export type ReturnOf_never<T> = T extends (...args: any[]) => infer R ? R : never;

export type HookCaller<T extends Hooks> = <K extends keyof T>(
                                            name: K,
                                            ...args: Parameters<T[K]>
                                        ) => ReturnOf_void<T[K]>

export type WithHooks<T extends Hooks> = {callHook: HookCaller<T>}

export type GetHooks<T extends WithHooks<any>>
    = T extends WithHooks<infer U> ? U : never;
    //= T["callHook"] extends HookCaller<infer U> ? U : never;

export type HooksProvider<T extends WithHooks<any>>
    = (target: T) => HookCaller<GetHooks<T>>;
                     //T["callHook"];

type HandlersProvider<T extends WithHooks<any>>
    = T extends WithHooks<infer U>
        ? {[K in keyof U]: (
                this   : void,
                source : T,
                ...args: Parameters<U[K]>
            ) => ReturnOf_never<U[K]>}
        : never;
/**/

export function hooks<T extends WithHooks<any>>(
                            handlersProvider: HandlersProvider<NoInfer<T>>
                        ): HooksProvider<T> {

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

/**

type AH = {
    "foo": (i: number) => void
};

class A {

    readonly callHook: HookCaller<AH>;

    // NO_HOOKS quite hard to create (?).
    constructor(hooksProvider: HooksProvider<A>) {
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