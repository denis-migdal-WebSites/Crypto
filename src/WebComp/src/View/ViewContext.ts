import { Elems } from "./extractElements";

export type Root = HTMLElement|DocumentFragment;

export type ViewCtx<E extends Elems = Elems> = {
    target  : HTMLElement,
    root    : Root,
    elements: E
};

export type ViewCallback<
                    Ctx    extends ViewCtx,
                    Args   extends unknown[],
                    Return
    > = (this: void, ctx: Ctx, ...args: Args) => Return;