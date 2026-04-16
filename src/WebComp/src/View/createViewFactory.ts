import createInstance, { Constructible } from "../utils/createInstance";
import { Hooks, HooksProvider }          from "../utils/Hooks/Hooks";
import WithHooks, { GetHooks }           from "../utils/Hooks/WithHooks";

import resolveElements, { Elems, ElemsDesc }    from "./resolveElements";
import { createViewHooksProvider, GetHandlers } from "./handlers";
import ShadowTemplate, { ShadowTemplateArgs }   from "./ShadowTemplate";
import { Root, ViewCallback, ViewCtx }          from "./ViewContext";
import { NULL_OBJ, NULL_OP } from "../utils/NullObjects";
import Renderer from "../utils/FrameScheduler/Renderer";

type Data = Record<string, any>;

type ControllerProviderCtx<T extends Hooks, D extends Data> = {
        hooksProvider: HooksProvider<T>
    } & D;

export type ControllerProvider<T extends object, D extends Data>
    = Constructible<T & {readonly properties?: D}, NoInfer<[ControllerProviderCtx<GetHooks<T>, D>]>>;

// fct
export type ViewFactoryControllerProvider<C extends object|null, D extends Data>
                    = C extends null
                        ? null
                        : ControllerProvider<NonNullable<C>, D>

export type ViewFactoryArgs<
            C extends object|null,
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
                        C extends object|null = null,
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

            const ctrlCtx = { ...opts};

            // likely a WithHooks...
            if( "callHook" in Controller.prototype ) {
                // @ts-ignore
                const handlers = args.on ?? {} as any;
                // @ts-ignore
                ctrlCtx.hooksProvider = createViewHooksProvider(ctx, handlers);
            }            

            //TODO...
            controller = createInstance(Controller, ctrlCtx as any) as NonNullable<C>;
        }

        // setup UI...
        const render = (ctrler: C = controller) => {
            // @ts-ignore
            console.warn("render :)", ctrler.properties.ok);
        }

        const ui = new Renderer( render );

        // execute it even if no controllers.
        // processDataChange(ctx, controller); - no initial calls.
        attachController (ctx, controller);

        return {
            ctx,
            controller,
            render       : (ctrler: C = controller) => {
                render(ctrler);
                // was manually rendered.
                ui.cancelScheduledRender();
            },
            requestRender: () => ui.requestRender(),
        } 
    }
}