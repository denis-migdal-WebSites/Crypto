type Hook  = (...args: any[]) => unknown;
export type Hooks = Record<string, Hook>;

interface WithHooks<T extends Hooks = Hooks> {
    readonly callHook: T;
}

export type GetHooks<T extends WithHooks>
    = T extends WithHooks<infer U> ? U : never;

export function createViewHooksProvider<
                        T   extends WithHooks,
                    >() {

    type Hooks = GetHooks<T>; // works if in generic template.
    const hooks = {} as Hooks;

    // first args is target (controller).
    return <K extends keyof Hooks>(name: K,
                                ...args: Parameters<Hooks[K]>) => {

        const hook = hooks[name];
        if( hook === null) // null ou undefined
        //if( hook === undefined)
        //if( ! hook )
        //if( name in hooks )
           return;

        return hook(...args)
    };
}