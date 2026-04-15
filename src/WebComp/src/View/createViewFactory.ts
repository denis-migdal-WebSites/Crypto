import createInstance, { Constructible } from "../utils/createInstance";
import { Hooks, HooksProvider }          from "../utils/Hooks";
import WithHooks, { GetHooks }           from "../utils/WithHooks";

import resolveElements, { Elems, ElemsDesc }    from "./resolveElements";
import { createViewHooksProvider, GetHandlers } from "./handlers";
import ShadowTemplate, { ShadowTemplateArgs }   from "./ShadowTemplate";
import { Root, ViewCallback, ViewCtx }          from "./ViewContext";
import { Data } from "../utils/Properties";
import { NULL_OBJ, NULL_OP } from "../utils/NullObjects";

type ControllerProviderCtx<T extends Hooks, D extends Data> = {
        hooksProvider: HooksProvider<T>,
        data         : D
    };

export type ControllerProvider<T extends WithHooks, D extends Data>
    = Constructible<T & {readonly data?: D}, NoInfer<[ControllerProviderCtx<GetHooks<T>, D>]>>;

// fct
export type ViewFactoryControllerProvider<C extends WithHooks|null, D extends Data>
                    = C extends null
                        ? null
                        : ControllerProvider<NonNullable<C>, D>

export type ViewFactoryArgs<
            C extends WithHooks|null,
            E extends Elems = {},
    > = 
        {
            template?: ShadowTemplateArgs,
            elements?: ElemsDesc<E>,
        } & NoInfer<C extends WithHooks ? {
            // controller accessible here.
            on      ?: GetHandlers<ViewCtx<E>, NonNullable<C>>
        }: {}>
        & NoInfer<{
                attachController?: ViewCallback<ViewCtx<E>, [controller: Omit<C, "callHook">], void>,
            }
    >

const FCT_NULL_OBJ = <T>(): T => NULL_OBJ as T;

// Controller needs to be its own parameter, cf:
// - https://github.com/microsoft/TypeScript/issues/63378
// - https://github.com/microsoft/TypeScript/issues/63377
export default function createViewFactory<
                        C extends WithHooks|null = null,
                        E extends Elems = {},
                        D extends Data  = {}
                >(
                    Controller: ViewFactoryControllerProvider<C, D>,
                    args      : ViewFactoryArgs<C, E>
                ) {

    const template = new ShadowTemplate(args.template ?? {});

    const elemsResolver = "elements" in args
            ? (target: Root) => resolveElements(target, args.elements!)
            : FCT_NULL_OBJ<E>;

    const attachController = "attachController" in args
                                ? args.attachController
                                : NULL_OP;

    return (target: HTMLElement, opts: Partial<D> = {}) => {

        const root     = template.createShadowRoot(target);
        const elements = elemsResolver(root);

        const ctx = {
            target,
            root,
            elements,
        };

        let controller = null as C;

        if( Controller !== null ) {

            // @ts-ignore: dunno why it says that "on" doesn't exists...
            //TODO: only if withHooks.
            const handlers = args.on ?? {} as any;
            const hooksProvider = createViewHooksProvider(ctx, handlers);

            const ctrlCtx = {
                hooksProvider,
                data         : opts,
                //TODO: data -> target
            }

            //TODO...
            controller = createInstance(Controller, ctrlCtx as any) as NonNullable<C>;
        }

        // execute it even if no controllers.
        // processDataChange(ctx, controller); - no initial calls.
        attachController (ctx, controller);

        return {
            ctx,
            controller,
        } 
    }
}