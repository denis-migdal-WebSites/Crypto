import { Elems } from "../resolveElements";
import { ViewCtx } from "../ViewContext";

export default function RefreshWhenPropertiesChanged<E extends Elems,
                                              C extends {properties: D},
                                              D extends Record<string, any>
                                              >(
                            callback : (ctx: ViewCtx<E>, ctrler: C) => void
                        ) {

    const obj = {
        attachController: callback
    }

    return () => obj;
}