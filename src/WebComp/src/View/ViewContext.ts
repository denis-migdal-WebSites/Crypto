import { Data } from "../utils/Properties";
import { Elems } from "./resolveElements";

export type Root = HTMLElement|DocumentFragment;

export type ViewCtx<E extends Elems = Elems, D extends Data = Data> = {
    target  : HTMLElement,
    root    : Root,
    elements: E,
    data    : D
};

export type ViewCallback<
                    Ctx    extends ViewCtx,
                    Args   extends unknown[],
                    Return
    > = (this: void, ctx: Ctx, ...args: Args) => Return;