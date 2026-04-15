import { Hooks, HooksProvider, ReturnOf_never, ReturnOf_void } from "../utils/Hooks/Hooks";
import WithHooks, { GetHooks }   from "../utils/Hooks/WithHooks";
import { ViewCallback, ViewCtx } from "./ViewContext";

type AsHandlers<Ctx extends ViewCtx, T extends Hooks> = {
    [K in keyof T]: ViewCallback<Ctx, Parameters<T[K]>, ReturnOf_never<T[K]>>
};

export type GetHandlers<
        Ctx extends ViewCtx,
        T   extends WithHooks
    > = AsHandlers<Ctx, GetHooks<T>>;

export function createViewHooksProvider<
                        Ctx extends ViewCtx,
                        T   extends WithHooks,
                    >(
                            ctx     : Ctx,
                            handlers: GetHandlers<Ctx, T>
                        ): HooksProvider<GetHooks<T>> {

    type H = GetHooks<T>;

    // first args is target (controller).
    return <K extends keyof H>(name: K,
                                ...args: Parameters<H[K]>): ReturnOf_void<H[K]> => {

        const hook = handlers[name];
        if( hook === undefined )
            // @ts-ignore
            return;
        //if( ! hook ) return;

        return hook(ctx as never, ...args) as ReturnOf_void<H[K]>;
    };
}