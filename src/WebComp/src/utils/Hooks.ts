type Hook<
            Args extends any[]     = any[],
            Ret  extends unknown   = unknown
    > = (...args: Args) => Ret;
export type Hooks = Record<string, Hook>;

export type ReturnOf_void <T> = T extends Hook<infer _, infer R> ? R : void;
export type ReturnOf_never<T> = T extends Hook<infer _, infer R> ? R : never;

export type HookCaller<T extends Hooks> = <K extends keyof T>(
                                            name: K,
                                            ...args: Parameters<T[K]>
                                        ) => ReturnOf_void<T[K]>

// having (this) => HookCaller makes inheritance more complex.
export type HooksProvider<T extends Hooks> = HookCaller<T>;

export function hooks<T extends Hooks>(
                            handlersProvider: T
                        ): HooksProvider<T> {

    return (<K extends keyof T>(name: K, ...args: Parameters<T[K]>): ReturnOf_void<T[K]> => {

        if( ! (name in handlersProvider) )
            // @ts-ignore
            return;

        return handlersProvider[name](...args) as ReturnOf_void<T[K]>;
    });
}