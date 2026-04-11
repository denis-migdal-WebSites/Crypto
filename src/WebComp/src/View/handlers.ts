import { Hooks, HooksProvider, ReturnOf_never, ReturnOf_void } from "../utils/Hooks";
import WithHooks, { GetHooks }   from "../utils/WithHooks";
import { ViewCallback, ViewCtx } from "./ViewContext";

type AsHandlers<Ctx extends ViewCtx, T extends Hooks> = {
    [K in keyof T as `on${Capitalize<K&string>}`]:
            ViewCallback<Ctx, Parameters<T[K]>, ReturnOf_never<T[K]>>
};

export type GetHandlers<
        Ctx extends ViewCtx,
        T   extends WithHooks
    > = AsHandlers<Ctx, GetHooks<T>>;
    
export function isHandlerName(name: string): name is `on${Capitalize<string>}` {
    return name[0] === "o" && name[1] === "n" && name[2] >= "A" && name[2] <= "Z";
}

export function getHookName(name: `on${Capitalize<string>}`) {
    return name[2].toLocaleLowerCase() + name.slice(3);
}

export function createViewHooksProvider<
                        Ctx extends ViewCtx,
                        T   extends WithHooks,
                        H   extends Hooks = GetHooks<T>
                    >(
                            ctx     : Ctx,
                            handlers: GetHandlers<Ctx, T>
                        ): HooksProvider<H> {

    const hooks = {} as H;

    for(const name in handlers) {
        if( ! isHandlerName(name) )
            continue;

        // @ts-ignore
        hooks[getHookName(name)] = handlers[name];
    }

    // first args is target (controller).
    return <K extends keyof H>(name: K,
                                ...args: Parameters<H[K]>): ReturnOf_void<H[K]> => {

        const hook = hooks[name];
        if( hook === undefined )
            // @ts-ignore
            return;
        //if( ! hook ) return;

        return hook(ctx as never, ...args) as ReturnOf_void<H[K]>;
    };
}