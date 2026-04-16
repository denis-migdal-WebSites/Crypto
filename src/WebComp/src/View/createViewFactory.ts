import createInstance, { Constructible } from "../utils/createInstance";
import { Hooks, HooksProvider }          from "../utils/Hooks/Hooks";
import WithHooks, { GetHooks }           from "../utils/Hooks/WithHooks";

import resolveElements, { Elems, ElemsDesc }    from "./resolveElements";
import { createViewHooksProvider, GetHandlers } from "./handlers";
import ShadowTemplate, { ShadowTemplateArgs }   from "./ShadowTemplate";
import { Root, ViewCallback, ViewCtx }          from "./ViewContext";
import { NULL_OBJ, NULL_OP } from "../utils/NullObjects";
import Renderer from "../utils/FrameScheduler/Renderer";
import { onPropertiesChange } from "../utils/Properties/PropertiesListeners";

type Data = Record<string, any>;

type ControllerProviderCtx<T extends Hooks, D extends Data> = {
        hooksProvider: HooksProvider<T>
    } & D;

export type ControllerProvider<T extends object, D extends Data>
    = Constructible<T & {readonly properties?: D}, NoInfer<[ControllerProviderCtx<GetHooks<T>, D>]>>;

type UI<E extends Elems, C> = {
    attachController?: (ctx: ViewCtx<E>, controller: C) => void
    refresh         ?: (ctx: ViewCtx<E>, controller: C) => void
};

type UIDesc<E extends Elems, C> = (() => UI<E, C>) | {[key: string]: UIDesc<E, C>};

// fct
export type ViewFactoryControllerProvider<C extends object|null, D extends Data>
                    = C extends null
                        ? null
                        : ControllerProvider<NonNullable<C>, D>

type AttachControllerCallback<E extends Elems, C> = ViewCallback<ViewCtx<E>, [
                        controller: Omit<C, "callHook">,
                        onRefresh : (callback: () => void ) => void
                    ], void>;

export type ViewFactoryArgs<
            C extends object|null,
            E extends Elems = {},
    > = 
        {
            template?: ShadowTemplateArgs,
            elements?: ElemsDesc<E>,
            ui      ?: NoInfer<UIDesc<E, C>>
        } & NoInfer<C extends WithHooks ? {
                // controller accessible here.
                on      ?: GetHandlers<ViewCtx<E>, NonNullable<C>>
            }: {}>
        & NoInfer<{
                attachController?: AttachControllerCallback<E, C>,
            }>;

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

    const template         = new ShadowTemplate(args.template ?? {});
    const elementsResolver = createElementsResolver(args.elements);

    const attachController = args.attachController ?? NULL_OP;

    return (target: HTMLElement, opts: Partial<D> = {}) => {

        const root     = template.createShadowRoot(target);
        const elements = elementsResolver(root);

        const ctx = { target, root, elements, };

        const controller = createController<C, E, D>(ctx, Controller, opts);
        const ui         = createUi();
       
        attachController(ctx, controller, ui.registerRefreshHook);

        if( controller !== null && "properties" in controller)
            onPropertiesChange( controller.properties as any,
                                () => ui.requestRefresh() )

        return {
            ctx,
            controller,
            refresh       : ui.refresh,
            requestRefresh: ui.requestRefresh
        } 
    }
}

function createElementsResolver<E extends Elems>(elements?: ElemsDesc<E>) {

    if( elements === undefined)
        return FCT_NULL_OBJ<E>;

    return (target: Root) => resolveElements(target, elements);
}

function createController<
                            C extends object|null,
                            E extends Elems,
                            D extends Record<string, any>
                        >(ctx       : ViewCtx<E>,
                          Controller: ViewFactoryControllerProvider<C, D>,
                          opts      : NoInfer<Partial<D>>
                        ) {

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

    return controller;
}

// ===============================================
//TODO: move some (?).

function createUi() {

    const callbacks = new Array<() => void>();

    const render = function() {
        for(let i = 0; i < callbacks.length; ++i)
            callbacks[i]();
    }

    const renderer = new Renderer( render );
    renderer.requestRender();

    return {
        registerRefreshHook( callback: () => void ) {
            callbacks.push(callback);
        },
        refresh() {
            render();
            // was manually rendered.
            renderer.cancelScheduledRender();
        },
        requestRefresh() {
            renderer.requestRender();
        }
    }
}