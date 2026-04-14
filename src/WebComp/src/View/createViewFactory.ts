import createInstance, { Constructible } from "../utils/createInstance";
import { Hooks, HooksProvider }          from "../utils/Hooks";
import WithHooks, { GetHooks }           from "../utils/WithHooks";

import validateData                             from "./validateData";
import resolveElements, { Elems, ElemsDesc }    from "./resolveElements";
import { createViewHooksProvider, GetHandlers } from "./handlers";
import ShadowTemplate, { ShadowTemplateArgs }   from "./ShadowTemplate";
import { Root, ViewCallback, ViewCtx }          from "./ViewContext";
import { Data, DataDesc } from "../utils/Properties";

type ControllerProviderCtx<T extends Hooks, D extends Data> = {
        hooksProvider: HooksProvider<T>,
        data         : D
    };

export type ControllerProvider<T extends WithHooks, D extends Data>
    = Constructible<T, NoInfer<[ControllerProviderCtx<GetHooks<T>, D>]>>;

// fct
export type ViewFactoryControllerProvider<C extends WithHooks|null, D extends Data>
                    = C extends null
                        ? null
                        : ControllerProvider<NonNullable<C>, D>

export type ViewFactoryArgs<
            C extends WithHooks|null,
            E extends Elems = {},
            D extends Data  = {}
    > = 
        {
            elements?: ElemsDesc<E>,
            data    ?: DataDesc<D>,
        }
        & NoInfer<
            (C extends null
            // {} is too permissive in TS...
                    ? Record<`on${Capitalize<string>}`, never>
                    : GetHandlers<ViewCtx<E, D>, NonNullable<C>>)
            & ShadowTemplateArgs
            & {
                attachController?: ViewCallback<ViewCtx<E, D>, [controller: Omit<C, "callHook">], void>,
                processDataChange?: ViewCallback<ViewCtx<E, D>, [controller: Omit<C, "callHook">], void>,
            }
    >

//TODO: move to utils
const NULL_OP = () => {};

const NULL_OBJ = {};
function NULL_OP_OBJ<T>(): T {
    return NULL_OBJ as T;
}

// Controller needs to be its own parameter, cf:
// - https://github.com/microsoft/TypeScript/issues/63378
// - https://github.com/microsoft/TypeScript/issues/63377
export default function createViewFactory<
                        C extends WithHooks|null = null,
                        E extends Elems = {},
                        D extends Data  = {}
                >(
                    Controller: ViewFactoryControllerProvider<C, D>,
                    args      : ViewFactoryArgs<C, E, D>
                ) {

    const template = new ShadowTemplate(args);

    const processDataChange = "processDataChange" in args
                                ? args.processDataChange
                                : NULL_OP;

    const attachController = "attachController" in args
                                ? args.attachController
                                : NULL_OP;
    
    const resolveElems = "elements" in args
            ? (target: Root) => resolveElements(target, args.elements!)
            : NULL_OP_OBJ<E>;

    const validate = "data" in args
            ? (data: Partial<D>) => validateData(data, args.data!)
            : NULL_OP_OBJ<D>;
    
    return (target: HTMLElement, opts: Partial<D> = {}) => {

        const root     = template.createShadowRoot(target);
        const elements = resolveElems(root);
        const data     = validate(opts);

        const ctx = {
            target,
            root,
            elements,
            data,
        };

        let controller = null as C;
        if( Controller !== null ) {

            const ctrlCtx = {
                hooksProvider: createViewHooksProvider(ctx, args),
                data
            }

            controller = createInstance(Controller, ctrlCtx) as NonNullable<C>;
        }

        // execute it even if no controllers.
        // processDataChange(ctx, controller); - no initial calls.
        attachController (ctx, controller);

        return {
            ctx,
            controller,
            setData(data: Partial<D>) {
                ctx.data = validate(data);
                processDataChange(ctx, controller);
            }
        } 
    }
}